import { Request, Response, NextFunction } from 'express';
import { AddressRepository } from '../repositories/addressRepository';
import { createError } from '../middleware/errorHandler';
import { CreateAddressRequest, UpdateAddressRequest } from '../types';

const addressRepository = new AddressRepository();

export class AddressController {
  // Create a new address
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const addressData: CreateAddressRequest = req.body;
      
      // Validate required fields
      if (!addressData.client_id || !addressData.street || !addressData.city || !addressData.state || !addressData.postal_code) {
        throw createError('Client ID, street, city, state, and postal code are required', 400);
      }

      const newAddress = await addressRepository.create(addressData);
      
      res.status(201).json({
        success: true,
        data: newAddress,
        message: 'Address created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all addresses
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await addressRepository.findAll();
      
      res.json({
        success: true,
        data: addresses,
        message: 'Addresses retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get address by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const address = await addressRepository.findById(id);
      
      if (!address) {
        throw createError('Address not found', 404);
      }

      res.json({
        success: true,
        data: address,
        message: 'Address retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get addresses by client ID
  async getByClientId(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId } = req.params;
      const addresses = await addressRepository.findByClientId(clientId);
      
      res.json({
        success: true,
        data: addresses,
        message: 'Client addresses retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get primary address by client ID
  async getPrimaryByClientId(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId } = req.params;
      const address = await addressRepository.findPrimaryByClientId(clientId);
      
      if (!address) {
        throw createError('No primary address found for this client', 404);
      }

      res.json({
        success: true,
        data: address,
        message: 'Primary address retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update address
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateAddressRequest = req.body;
      
      // Check if address exists
      const existingAddress = await addressRepository.findById(id);
      if (!existingAddress) {
        throw createError('Address not found', 404);
      }

      const updatedAddress = await addressRepository.update(id, updateData);
      
      if (!updatedAddress) {
        throw createError('Failed to update address', 500);
      }

      res.json({
        success: true,
        data: updatedAddress,
        message: 'Address updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete address
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Check if address exists
      const existingAddress = await addressRepository.findById(id);
      if (!existingAddress) {
        throw createError('Address not found', 404);
      }

      const deleted = await addressRepository.delete(id);
      
      if (!deleted) {
        throw createError('Failed to delete address', 500);
      }

      res.json({
        success: true,
        message: 'Address deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Search addresses by city
  async searchByCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { city } = req.query;
      
      if (!city || typeof city !== 'string') {
        throw createError('City parameter is required', 400);
      }

      const addresses = await addressRepository.findByCity(city);
      
      res.json({
        success: true,
        data: addresses,
        message: 'Search completed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

