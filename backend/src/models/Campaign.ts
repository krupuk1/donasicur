import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { Campaign, CampaignFilters } from '../types';

export class CampaignModel {
  static async findById(id: number, includeRelations = false): Promise<Campaign | null> {
    try {
      let query = `
        SELECT c.*, cat.name as category_name, cat.icon as category_icon,
               u.username, u.full_name as user_full_name, u.avatar as user_avatar
        FROM campaigns c
        LEFT JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `;

      const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
      
      if (rows.length === 0) return null;

      const campaign = this.formatCampaign(rows[0]);

      if (includeRelations) {
        // Get recent donations
        const [donationRows] = await pool.execute<RowDataPacket[]>(
          `SELECT d.*, u.username, u.full_name as donor_full_name
           FROM donations d
           LEFT JOIN users u ON d.user_id = u.id
           WHERE d.campaign_id = ? AND d.payment_status = 'paid'
           ORDER BY d.created_at DESC
           LIMIT 10`,
          [id]
        );

        // Get comments
        const [commentRows] = await pool.execute<RowDataPacket[]>(
          `SELECT c.*, u.username, u.full_name, u.avatar
           FROM comments c
           JOIN users u ON c.user_id = u.id
           WHERE c.campaign_id = ? AND c.is_approved = TRUE
           ORDER BY c.created_at DESC
           LIMIT 10`,
          [id]
        );

        // Get updates
        const [updateRows] = await pool.execute<RowDataPacket[]>(
          `SELECT * FROM campaign_updates 
           WHERE campaign_id = ? 
           ORDER BY created_at DESC`,
          [id]
        );

        campaign.donations = donationRows;
        campaign.comments = commentRows;
        campaign.updates = updateRows;
      }

      return campaign;
    } catch (error) {
      throw error;
    }
  }

  static async findBySlug(slug: string): Promise<Campaign | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT c.*, cat.name as category_name, cat.icon as category_icon,
                u.username, u.full_name as user_full_name, u.avatar as user_avatar
         FROM campaigns c
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.slug = ?`,
        [slug]
      );
      
      return rows.length > 0 ? this.formatCampaign(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters: CampaignFilters = {}): Promise<{ campaigns: Campaign[]; total: number }> {
    try {
      const { 
        page = 1, 
        limit = 12, 
        search, 
        category, 
        status = 'active', 
        is_urgent,
        user_id,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = filters;
      
      const offset = (page - 1) * limit;

      let whereClause = '1 = 1';
      const queryParams: any[] = [];

      if (status) {
        whereClause += ' AND c.status = ?';
        queryParams.push(status);
      }

      if (search) {
        whereClause += ' AND (c.title LIKE ? OR c.description LIKE ? OR c.story LIKE ?)';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      if (category) {
        whereClause += ' AND c.category_id = ?';
        queryParams.push(category);
      }

      if (is_urgent !== undefined) {
        whereClause += ' AND c.is_urgent = ?';
        queryParams.push(is_urgent);
      }

      if (user_id) {
        whereClause += ' AND c.user_id = ?';
        queryParams.push(user_id);
      }

      // Get total count
      const [countRows] = await pool.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total 
         FROM campaigns c 
         WHERE ${whereClause}`,
        queryParams
      );
      const total = countRows[0].total;

      // Get campaigns
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT c.*, cat.name as category_name, cat.icon as category_icon,
                u.username, u.full_name as user_full_name, u.avatar as user_avatar
         FROM campaigns c
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.user_id = u.id
         WHERE ${whereClause}
         ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}
         LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

      return {
        campaigns: rows.map(row => this.formatCampaign(row)),
        total
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    try {
      const {
        user_id,
        category_id,
        title,
        slug,
        description,
        story,
        target_amount,
        image_url,
        gallery,
        start_date,
        end_date,
        is_urgent = false,
        meta_title,
        meta_description
      } = campaignData;

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO campaigns (
          user_id, category_id, title, slug, description, story, target_amount,
          image_url, gallery, start_date, end_date, is_urgent, meta_title, meta_description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          user_id, category_id, title, slug, description, story, target_amount,
          image_url, JSON.stringify(gallery), start_date, end_date, is_urgent,
          meta_title, meta_description
        ]
      );

      const newCampaign = await this.findById(result.insertId);
      if (!newCampaign) {
        throw new Error('Failed to create campaign');
      }

      return newCampaign;
    } catch (error) {
      throw error;
    }
  }

  static async update(id: number, campaignData: Partial<Campaign>): Promise<Campaign | null> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      Object.entries(campaignData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'user_id') {
          if (key === 'gallery' && Array.isArray(value)) {
            fields.push(`${key} = ?`);
            values.push(JSON.stringify(value));
          } else {
            fields.push(`${key} = ?`);
            values.push(value);
          }
        }
      });

      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      await pool.execute(
        `UPDATE campaigns SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM campaigns WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async incrementViewCount(id: number): Promise<void> {
    try {
      await pool.execute(
        'UPDATE campaigns SET view_count = view_count + 1 WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  static async incrementShareCount(id: number): Promise<void> {
    try {
      await pool.execute(
        'UPDATE campaigns SET share_count = share_count + 1 WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  static async getPopularCampaigns(limit = 6): Promise<Campaign[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT c.*, cat.name as category_name, cat.icon as category_icon,
                u.username, u.full_name as user_full_name, u.avatar as user_avatar
         FROM campaigns c
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.status = 'active'
         ORDER BY c.donation_count DESC, c.current_amount DESC
         LIMIT ?`,
        [limit]
      );

      return rows.map(row => this.formatCampaign(row));
    } catch (error) {
      throw error;
    }
  }

  static async getUrgentCampaigns(limit = 6): Promise<Campaign[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT c.*, cat.name as category_name, cat.icon as category_icon,
                u.username, u.full_name as user_full_name, u.avatar as user_avatar
         FROM campaigns c
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.status = 'active' AND c.is_urgent = TRUE
         ORDER BY c.created_at DESC
         LIMIT ?`,
        [limit]
      );

      return rows.map(row => this.formatCampaign(row));
    } catch (error) {
      throw error;
    }
  }

  static async getRecentCampaigns(limit = 6): Promise<Campaign[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT c.*, cat.name as category_name, cat.icon as category_icon,
                u.username, u.full_name as user_full_name, u.avatar as user_avatar
         FROM campaigns c
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.status = 'active'
         ORDER BY c.created_at DESC
         LIMIT ?`,
        [limit]
      );

      return rows.map(row => this.formatCampaign(row));
    } catch (error) {
      throw error;
    }
  }

  static async approveReject(id: number, status: 'active' | 'rejected', rejectionReason?: string): Promise<boolean> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE campaigns SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, rejectionReason || null, id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  private static formatCampaign(row: any): Campaign {
    const campaign = { ...row };
    
    // Parse gallery JSON
    if (campaign.gallery && typeof campaign.gallery === 'string') {
      try {
        campaign.gallery = JSON.parse(campaign.gallery);
      } catch (error) {
        campaign.gallery = [];
      }
    }

    // Add category info if exists
    if (campaign.category_name) {
      campaign.category = {
        id: campaign.category_id,
        name: campaign.category_name,
        icon: campaign.category_icon
      };
    }

    // Add user info if exists
    if (campaign.username) {
      campaign.user = {
        id: campaign.user_id,
        username: campaign.username,
        full_name: campaign.user_full_name,
        avatar: campaign.user_avatar
      };
    }

    // Calculate progress percentage
    campaign.progress_percentage = campaign.target_amount > 0 
      ? Math.round((campaign.current_amount / campaign.target_amount) * 100)
      : 0;

    return campaign;
  }
}