-- OrionTek Database Schema
-- Create database (run this command separately)
-- CREATE DATABASE oriontek_db;

-- Connect to the database
-- \c oriontek_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Dominican Republic',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_addresses_client_id ON addresses(client_id);
CREATE INDEX IF NOT EXISTS idx_addresses_primary ON addresses(client_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_addresses_city ON addresses(city);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at 
    BEFORE UPDATE ON addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO clients (name, email, phone, company) VALUES
('Juan Pérez', 'juan.perez@email.com', '+1-809-555-0101', 'Tech Solutions Inc.'),
('María García', 'maria.garcia@email.com', '+1-809-555-0102', 'Digital Innovations'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '+1-809-555-0103', 'Software Development Co.'),
('Ana López', 'ana.lopez@email.com', '+1-809-555-0104', 'Web Services Ltd.'),
('Luis Martínez', 'luis.martinez@email.com', '+1-809-555-0105', 'IT Consulting Group');

-- Insert sample addresses
INSERT INTO addresses (client_id, street, city, state, postal_code, country, is_primary) VALUES
((SELECT id FROM clients WHERE email = 'juan.perez@email.com'), 'Calle Principal 123', 'Santo Domingo', 'Distrito Nacional', '10101', 'Dominican Republic', true),
((SELECT id FROM clients WHERE email = 'juan.perez@email.com'), 'Avenida Central 456', 'Santiago', 'Santiago', '51000', 'Dominican Republic', false),
((SELECT id FROM clients WHERE email = 'maria.garcia@email.com'), 'Boulevard del Norte 789', 'Santo Domingo', 'Distrito Nacional', '10102', 'Dominican Republic', true),
((SELECT id FROM clients WHERE email = 'carlos.rodriguez@email.com'), 'Calle del Sur 321', 'La Romana', 'La Romana', '22000', 'Dominican Republic', true),
((SELECT id FROM clients WHERE email = 'ana.lopez@email.com'), 'Avenida del Este 654', 'Santo Domingo', 'Distrito Nacional', '10103', 'Dominican Republic', true),
((SELECT id FROM clients WHERE email = 'luis.martinez@email.com'), 'Calle del Oeste 987', 'Puerto Plata', 'Puerto Plata', '57000', 'Dominican Republic', true);

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

