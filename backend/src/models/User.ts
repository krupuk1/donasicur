import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { User } from '../types';

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findByVerificationToken(token: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE verification_token = ?',
        [token]
      );
      
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findByResetToken(token: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
        [token]
      );
      
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData: Partial<User>): Promise<User> {
    try {
      const {
        username,
        email,
        password,
        full_name,
        phone,
        role = 'user',
        verification_token
      } = userData;

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO users (username, email, password, full_name, phone, role, verification_token)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [username, email, password, full_name, phone, role, verification_token]
      );

      const newUser = await this.findById(result.insertId);
      if (!newUser) {
        throw new Error('Failed to create user');
      }

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async update(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'created_at') {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      await pool.execute(
        `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
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
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}): Promise<{ users: User[]; total: number }> {
    try {
      const { page = 1, limit = 10, search, role } = filters;
      const offset = (page - 1) * limit;

      let whereClause = '1 = 1';
      const queryParams: any[] = [];

      if (search) {
        whereClause += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      if (role) {
        whereClause += ' AND role = ?';
        queryParams.push(role);
      }

      // Get total count
      const [countRows] = await pool.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
        queryParams
      );
      const total = countRows[0].total;

      // Get users
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT id, username, email, full_name, phone, avatar, role, is_verified, created_at, updated_at 
         FROM users 
         WHERE ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

      return {
        users: rows as User[],
        total
      };
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(id: number): Promise<boolean> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hashedPassword, id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async setResetToken(id: number, token: string, expires: Date): Promise<boolean> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        [token, expires, id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}