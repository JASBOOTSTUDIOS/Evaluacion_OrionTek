import { Request, Response, NextFunction } from 'express';
import { ClientRepository } from '../repositories/clientRepository';
import { createError } from '../middleware/errorHandler';
import { CreateClientRequest, UpdateClientRequest } from '../types';

const clientRepository = new ClientRepository();

export class ClientController {
  // Create a new client
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const clientData: CreateClientRequest = req.body;
      
      // Validate required fields
      if (!clientData.name || !clientData.email) {
        throw createError('Name and email are required', 400);
      }

      // Check if email already exists
      const existingClient = await clientRepository.findByEmail(clientData.email);
      if (existingClient) {
        throw createError('Email already exists', 409);
      }

      const newClient = await clientRepository.create(clientData);
      
      res.status(201).json({
        success: true,
        data: newClient,
        message: 'Client created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all clients
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await clientRepository.findAll();
      
      res.json({
        success: true,
        data: clients,
        message: 'Clients retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get client by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const client = await clientRepository.findById(id);
      
      if (!client) {
        throw createError('Client not found', 404);
      }

      res.json({
        success: true,
        data: client,
        message: 'Client retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get client with addresses
  async getWithAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const client = await clientRepository.findWithAddresses(id);
      
      if (!client) {
        throw createError('Client not found', 404);
      }

      res.json({
        success: true,
        data: client,
        message: 'Client with addresses retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update client
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateClientRequest = req.body;
      
      // Check if client exists
      const existingClient = await clientRepository.findById(id);
      if (!existingClient) {
        throw createError('Client not found', 404);
      }

      // If updating email, check if new email already exists
      if (updateData.email && updateData.email !== existingClient.email) {
        const emailExists = await clientRepository.findByEmail(updateData.email);
        if (emailExists) {
          throw createError('Email already exists', 409);
        }
      }

      const updatedClient = await clientRepository.update(id, updateData);
      
      if (!updatedClient) {
        throw createError('Failed to update client', 500);
      }

      res.json({
        success: true,
        data: updatedClient,
        message: 'Client updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete client
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Check if client exists
      const existingClient = await clientRepository.findById(id);
      if (!existingClient) {
        throw createError('Client not found', 404);
      }

      const deleted = await clientRepository.delete(id);
      
      if (!deleted) {
        throw createError('Failed to delete client', 500);
      }

      res.json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Search clients by name
  async searchByName(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      
      if (!name || typeof name !== 'string') {
        throw createError('Name parameter is required', 400);
      }

      const clients = await clientRepository.searchByName(name);
      
      res.json({
        success: true,
        data: clients,
        message: 'Search completed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

