export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  is_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Campaign {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  story: string;
  target_amount: number;
  current_amount: number;
  image_url?: string;
  gallery?: string[];
  status: 'draft' | 'pending' | 'active' | 'completed' | 'rejected' | 'suspended';
  rejection_reason?: string;
  start_date?: Date;
  end_date?: Date;
  is_urgent: boolean;
  view_count: number;
  donation_count: number;
  share_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  user?: User;
  category?: Category;
  donations?: Donation[];
  comments?: Comment[];
  updates?: CampaignUpdate[];
}

export interface Donation {
  id: number;
  campaign_id: number;
  user_id?: number;
  donor_name?: string;
  donor_email?: string;
  amount: number;
  message?: string;
  is_anonymous: boolean;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
  tripay_reference?: string;
  tripay_merchant_ref?: string;
  tripay_payment_url?: string;
  payment_fee: number;
  net_amount: number;
  paid_at?: Date;
  expired_at?: Date;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  campaign?: Campaign;
  user?: User;
}

export interface Comment {
  id: number;
  campaign_id: number;
  user_id: number;
  content: string;
  is_approved: boolean;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  campaign?: Campaign;
  user?: User;
}

export interface CampaignUpdate {
  id: number;
  campaign_id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  campaign?: Campaign;
}

export interface Withdrawal {
  id: number;
  campaign_id: number;
  user_id: number;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  admin_notes?: string;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  campaign?: Campaign;
  user?: User;
}

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  category: 'virtual_account' | 'ewallet' | 'retail' | 'qris';
  is_active: boolean;
  fee_flat: number;
  fee_percent: number;
  min_amount: number;
  max_amount?: number;
  icon_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdminLog {
  id: number;
  admin_id: number;
  action: string;
  target_type: string;
  target_id: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
  
  // Relations
  admin?: User;
}

export interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value?: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CampaignFilters extends PaginationQuery {
  category?: number;
  status?: string;
  is_urgent?: boolean;
  user_id?: number;
}

export interface DonationFilters extends PaginationQuery {
  campaign_id?: number;
  user_id?: number;
  payment_status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
}

// Tripay Types
export interface TripayCreatePayment {
  method: string;
  merchant_ref: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_items: Array<{
    sku?: string;
    name: string;
    price: number;
    quantity: number;
    product_url?: string;
    image_url?: string;
  }>;
  return_url?: string;
  expired_time?: number;
  signature: string;
}

export interface TripayPaymentResponse {
  reference: string;
  merchant_ref: string;
  payment_selection_type: string;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  callback_url: string;
  return_url: string;
  amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  pay_code?: string;
  pay_url?: string;
  checkout_url: string;
  status: string;
  expired_time: number;
  order_items: any[];
  instructions: any[];
  qr_code?: string;
  qr_url?: string;
}

export interface TripayCallback {
  reference: string;
  merchant_ref: string;
  payment_method: string;
  payment_method_code: string;
  total_amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  is_closed_payment: number;
  status: string;
  paid_at: number;
  note?: string;
}