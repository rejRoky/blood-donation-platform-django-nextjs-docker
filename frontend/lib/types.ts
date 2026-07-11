/** Types mirroring the Django REST API contract. */

export interface District {
  id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
  url?: string;
}

export interface Upazila {
  id: number;
  district_id: number;
  name: string;
  bn_name: string;
  url?: string;
}

export interface AddressDetail {
  district: number | null;
  upazila: number | null;
  district_name: string | null;
  upazila_name: string | null;
}

export interface UserProfile {
  id: string;
  mobile_number: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  profile_picture: string | null;
  blood_group: string | null;
  is_donate_first: boolean;
  is_donate: boolean;
  role: string | null;
  address: number | null;
  address_detail: AddressDetail | null;
  district_id: number | null;
  upazila_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Donor extends UserProfile {
  district_name: string | null;
  upazila_name: string | null;
  bn_district: string | null;
  bn_upazila: string | null;
  donation_count: number;
  last_donation_date: string | null;
  is_active: boolean;
}

export interface Donation {
  id: number;
  user: string;
  user_name: string;
  user_mobile: string;
  donation_date: string;
  date: string;
  amount: number | null;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LoginResponse {
  token: {
    access: string;
    refresh: string;
    token_type: string;
    expires_in: number;
  };
  user: UserProfile;
  user_address: {
    district: string;
    district_id: number;
    upazila: string;
    upazila_id: number;
  } | null;
}

export interface SiteSetting {
  site_name: string | null;
  site_logo: string | null;
  site_favicon: string | null;
  site_title: string | null;
  site_email: string | null;
  site_phone: string | null;
  site_address: string | null;
  site_facebook: string | null;
  site_linkedin: string | null;
  site_youtube: string | null;
  site_whatsapp: string | null;
  site_map: string | null;
  site_status: boolean;
}

/** Standard error envelope produced by the backend for every error. */
export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code: string;
  status_code: number;
}
