export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

