import { query } from '../config/database';
import { Client, CreateClientRequest, UpdateClientRequest, ClientWithAddresses } from '../types';

export class ClientRepository {
  // Commands (Write operations)
  async create(clientData: CreateClientRequest): Promise<Client> {
    const { name, email, phone, company } = clientData;
    
    const result = await query(
      `INSERT INTO clients (name, email, phone, company) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, phone, company]
    );
    
    return result.rows[0];
  }

  async update(id: string, clientData: UpdateClientRequest): Promise<Client | null> {
    const { name, email, phone, company } = clientData;
    
    const result = await query(
      `UPDATE clients 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           phone = COALESCE($3, phone), 
           company = COALESCE($4, company),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [name, email, phone, company, id]
    );
    
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM clients WHERE id = $1 RETURNING id',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  // Queries (Read operations)
  async findAll(): Promise<Client[]> {
    const result = await query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    
    return result.rows;
  }

  async findById(id: string): Promise<Client | null> {
    const result = await query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const result = await query(
      'SELECT * FROM clients WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  }

  async findWithAddresses(id: string): Promise<ClientWithAddresses | null> {
    const clientResult = await query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );
    
    if (!clientResult.rows[0]) return null;
    
    const addressesResult = await query(
      'SELECT * FROM addresses WHERE client_id = $1 ORDER BY is_primary DESC, created_at ASC',
      [id]
    );
    
    return {
      ...clientResult.rows[0],
      addresses: addressesResult.rows
    };
  }

  async searchByName(name: string): Promise<Client[]> {
    const result = await query(
      'SELECT * FROM clients WHERE name ILIKE $1 ORDER BY name',
      [`%${name}%`]
    );
    
    return result.rows;
  }
}
