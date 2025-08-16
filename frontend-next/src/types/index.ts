export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  client_id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientWithAddresses extends Client {
  addresses: Address[];
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface CreateAddressRequest {
  client_id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_primary?: boolean;
}

export interface UpdateAddressRequest {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_primary?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}
