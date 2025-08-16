import api from './api';
import { Address, CreateAddressRequest, UpdateAddressRequest, ApiResponse } from '@/types';

export const addressService = {
  // Get all addresses
  getAll: async (): Promise<ApiResponse<Address[]>> => {
    const response = await api.get('/addresses');
    return response.data;
  },

  // Get address by ID
  getById: async (id: string): Promise<ApiResponse<Address>> => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  // Get addresses by client ID
  getByClientId: async (clientId: string): Promise<ApiResponse<Address[]>> => {
    const response = await api.get(`/addresses/client/${clientId}`);
    return response.data;
  },

  // Get primary address by client ID
  getPrimaryByClientId: async (clientId: string): Promise<ApiResponse<Address>> => {
    const response = await api.get(`/addresses/client/${clientId}/primary`);
    return response.data;
  },

  // Create new address
  create: async (addressData: CreateAddressRequest): Promise<ApiResponse<Address>> => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Update address
  update: async (id: string, addressData: UpdateAddressRequest): Promise<ApiResponse<Address>> => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  // Delete address
  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  // Search addresses by city
  searchByCity: async (city: string): Promise<ApiResponse<Address[]>> => {
    const response = await api.get(`/addresses/search?city=${encodeURIComponent(city)}`);
    return response.data;
  },
};


