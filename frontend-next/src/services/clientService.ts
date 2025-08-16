import api from './api';
import { Client, ClientWithAddresses, CreateClientRequest, UpdateClientRequest, ApiResponse } from '@/types';

export const clientService = {
  // Get all clients
  getAll: async (): Promise<ApiResponse<Client[]>> => {
    const response = await api.get('/clients');
    return response.data;
  },

  // Get client by ID
  getById: async (id: string): Promise<ApiResponse<Client>> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Get client with addresses
  getWithAddresses: async (id: string): Promise<ApiResponse<ClientWithAddresses>> => {
    const response = await api.get(`/clients/${id}/addresses`);
    return response.data;
  },

  // Create new client
  create: async (clientData: CreateClientRequest): Promise<ApiResponse<Client>> => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  // Update client
  update: async (id: string, clientData: UpdateClientRequest): Promise<ApiResponse<Client>> => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  // Delete client
  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  // Search clients by name
  searchByName: async (name: string): Promise<ApiResponse<Client[]>> => {
    const response = await api.get(`/clients/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },
};


