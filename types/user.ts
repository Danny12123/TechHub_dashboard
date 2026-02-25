export interface User {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  id: string;
  role: "super_admin" | "user" | "seller";
  status: "pending" | "active" | "suspended";
  avatar_url: string;
  bio: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postal_code: string;
  currency_code?: string;
  country_id?: string;
  region_id?: string;
  wallet_balance: number;
  coins: number;
  email_verified: boolean;
  phone_verified: boolean;
  kyc_verified: boolean;
  is_2fa_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
}
