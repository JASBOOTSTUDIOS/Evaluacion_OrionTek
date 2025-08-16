import { query } from '../config/database';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '../types';

export class AddressRepository {
  // Commands (Write operations)
  async create(addressData: CreateAddressRequest): Promise<Address> {
    const { client_id, street, city, state, postal_code, country, is_primary } = addressData;
    
    // If this is a primary address, unset other primary addresses for this client
    if (is_primary) {
      await query(
        'UPDATE addresses SET is_primary = false WHERE client_id = $1',
        [client_id]
      );
    }
    
    const result = await query(
      `INSERT INTO addresses (client_id, street, city, state, postal_code, country, is_primary) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [client_id, street, city, state, postal_code, country || 'Dominican Republic', is_primary || false]
    );
    
    return result.rows[0];
  }

  async update(id: string, addressData: UpdateAddressRequest): Promise<Address | null> {
    const { street, city, state, postal_code, country, is_primary } = addressData;
    
    // If setting as primary, unset other primary addresses for this client
    if (is_primary) {
      const address = await this.findById(id);
      if (address) {
        await query(
          'UPDATE addresses SET is_primary = false WHERE client_id = $1 AND id != $2',
          [address.client_id, id]
        );
      }
    }
    
    const result = await query(
      `UPDATE addresses 
       SET street = COALESCE($1, street), 
           city = COALESCE($2, city), 
           state = COALESCE($3, state), 
           postal_code = COALESCE($4, postal_code),
           country = COALESCE($5, country),
           is_primary = COALESCE($6, is_primary),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [street, city, state, postal_code, country, is_primary, id]
    );
    
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM addresses WHERE id = $1 RETURNING id',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  // Queries (Read operations)
  async findAll(): Promise<Address[]> {
    const result = await query(
      'SELECT * FROM addresses ORDER BY created_at DESC'
    );
    
    return result.rows;
  }

  async findById(id: string): Promise<Address | null> {
    const result = await query(
      'SELECT * FROM addresses WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  async findByClientId(clientId: string): Promise<Address[]> {
    const result = await query(
      'SELECT * FROM addresses WHERE client_id = $1 ORDER BY is_primary DESC, created_at ASC',
      [clientId]
    );
    
    return result.rows;
  }

  async findPrimaryByClientId(clientId: string): Promise<Address | null> {
    const result = await query(
      'SELECT * FROM addresses WHERE client_id = $1 AND is_primary = true LIMIT 1',
      [clientId]
    );
    
    return result.rows[0] || null;
  }

  async findByCity(city: string): Promise<Address[]> {
    const result = await query(
      'SELECT * FROM addresses WHERE city ILIKE $1 ORDER BY city',
      [`%${city}%`]
    );
    
    return result.rows;
  }
}
