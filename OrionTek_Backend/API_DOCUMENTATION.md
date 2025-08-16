# OrionTek API Documentation

## Overview

The OrionTek API provides comprehensive client and address management capabilities following CQRS architecture principles. This API is fully documented using Swagger/OpenAPI 3.0 specification.

## 🚀 Quick Start

### Accessing the API Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3001/api-docs
```

### Health Check

Test if the server is running:

```bash
GET http://localhost:3001/health
```

## 📚 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Clients
- **POST** `/api/clients` - Create a new client
- **GET** `/api/clients` - Get all clients
- **GET** `/api/clients/{id}` - Get client by ID
- **GET** `/api/clients/{id}/addresses` - Get client with addresses
- **PUT** `/api/clients/{id}` - Update client
- **DELETE** `/api/clients/{id}` - Delete client
- **GET** `/api/clients/search?name={name}` - Search clients by name

### Addresses
- **POST** `/api/addresses` - Create a new address
- **GET** `/api/addresses` - Get all addresses
- **GET** `/api/addresses/{id}` - Get address by ID
- **GET** `/api/addresses/client/{clientId}` - Get addresses by client ID
- **GET** `/api/addresses/client/{clientId}/primary` - Get primary address by client ID
- **PUT** `/api/addresses/{id}` - Update address
- **DELETE** `/api/addresses/{id}` - Delete address
- **GET** `/api/addresses/search?city={city}` - Search addresses by city

## 🔧 Data Models

### Client
```json
{
  "id": "uuid",
  "name": "string (required, max 255)",
  "email": "string (required, max 255, unique)",
  "phone": "string (max 20)",
  "company": "string (max 255)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Address
```json
{
  "id": "uuid",
  "client_id": "uuid (required)",
  "street": "string (required, max 255)",
  "city": "string (required, max 100)",
  "state": "string (required, max 100)",
  "postal_code": "string (required, max 20)",
  "country": "string (max 100, default: 'Dominican Republic')",
  "is_primary": "boolean (default: false)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 📖 Using Swagger Documentation

### Interactive Testing
1. Open `http://localhost:3001/api-docs` in your browser
2. Browse endpoints by tags (Clients, Addresses, Search, Health)
3. Click on any endpoint to expand its documentation
4. Use the "Try it out" button to test endpoints directly
5. View request/response schemas and examples

### Tags Organization
- **Health**: System status and monitoring
- **Clients**: Client management operations (CRUD)
- **Addresses**: Address management operations
- **Search**: Search and filtering capabilities

### Request Examples

#### Create a Client
```bash
POST /api/clients
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan.perez@email.com",
  "phone": "+1-809-555-0101",
  "company": "Tech Solutions"
}
```

#### Create an Address
```bash
POST /api/addresses
Content-Type: application/json

{
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "street": "Calle Principal 123",
  "city": "Santo Domingo",
  "state": "Distrito Nacional",
  "postal_code": "10101",
  "country": "Dominican Republic",
  "is_primary": true
}
```

#### Search Clients by Name
```bash
GET /api/clients/search?name=Juan
```

#### Search Addresses by City
```bash
GET /api/addresses/search?city=Santo
```

## 🔒 Security & Validation

### Input Validation
- All endpoints include comprehensive input validation
- Email format validation for clients
- Required field validation
- Length constraints enforcement

### Error Handling
- Standardized error response format
- HTTP status codes following REST conventions
- Detailed error messages for debugging

### CORS Configuration
- Configurable CORS origins
- Credentials support enabled
- Security headers via Helmet

## 🏗️ Architecture

### CQRS Pattern
- **Commands**: Write operations (POST, PUT, DELETE)
- **Queries**: Read operations (GET)
- Clear separation of concerns

### Repository Pattern
- Abstracted data access layer
- Database-agnostic implementation
- Easy to test and maintain

### TypeScript
- Full type safety
- IntelliSense support
- Compile-time error checking

## 🚀 Development

### Running the Server
```bash
# Development mode with auto-reload
npm run dev

# Production build
npm run build
npm start
```

### Environment Variables
```env
# Database Configuration
DB_HOST=aws-1-us-east-2.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.lgujkfoagnizkpzpfpdg
DB_PASSWORD=your_password
DB_SSL=true

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Database Setup
The API automatically creates necessary tables and indexes on startup. Ensure your database connection is properly configured.

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```

## 🔍 Testing

### Manual Testing
Use the Swagger UI to test all endpoints interactively.

### Automated Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring

### Health Check
Monitor server status with the `/health` endpoint.

### Logging
- Database connection status
- Request/response logging
- Error tracking

## 🚀 Deployment

### Production Considerations
- Set `NODE_ENV=production`
- Configure production database
- Set appropriate CORS origins
- Enable rate limiting (future implementation)
- Add authentication (future implementation)

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

### Code Style
- Follow TypeScript best practices
- Use meaningful variable names
- Add JSDoc comments for Swagger
- Maintain consistent error handling

### Adding New Endpoints
1. Create controller method
2. Add route definition
3. Document with Swagger JSDoc
4. Update this documentation

## 📞 Support

For API support and questions:
- Email: dev@oriontek.com
- Documentation: `http://localhost:3001/api-docs`
- Health Check: `http://localhost:3001/health`

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**License**: MIT


