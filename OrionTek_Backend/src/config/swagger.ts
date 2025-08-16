import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OrionTek API - Client Management System',
      version: '1.0.0',
      description: `
        ## API Documentation for OrionTek Client Management System
        
        This API provides comprehensive client and address management capabilities following CQRS architecture principles.
        
        ### Features:
        - **Client Management**: Create, read, update, and delete client information
        - **Address Management**: Manage multiple addresses per client with primary address support
        - **Search & Filtering**: Advanced search capabilities for clients and addresses
        - **Data Validation**: Comprehensive input validation and error handling
        - **Security**: CORS, Helmet, and input sanitization
        
        ### Architecture:
        - **CQRS Pattern**: Separation of read and write operations
        - **Repository Pattern**: Clean data access abstraction
        - **TypeScript**: Full type safety and IntelliSense support
        - **PostgreSQL**: Robust relational database with UUIDs
        
        ### Authentication:
        Currently using basic API access. Future versions will include JWT authentication.
      `,
      contact: {
        name: 'OrionTek Development Team',
        email: 'dev@oriontek.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.oriontek.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Client: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the client'
            },
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Full name of the client'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Unique email address of the client'
            },
            phone: {
              type: 'string',
              maxLength: 20,
              description: 'Phone number of the client'
            },
            company: {
              type: 'string',
              maxLength: 255,
              description: 'Company or organization name'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the client was created'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the client was last updated'
            }
          }
        },
        Address: {
          type: 'object',
          required: ['client_id', 'street', 'city', 'state', 'postal_code'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the address'
            },
            client_id: {
              type: 'string',
              format: 'uuid',
              description: 'Reference to the client this address belongs to'
            },
            street: {
              type: 'string',
              maxLength: 255,
              description: 'Street address'
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'City name'
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'State or province'
            },
            postal_code: {
              type: 'string',
              maxLength: 20,
              description: 'Postal or ZIP code'
            },
            country: {
              type: 'string',
              maxLength: 100,
              default: 'Dominican Republic',
              description: 'Country name'
            },
            is_primary: {
              type: 'boolean',
              default: false,
              description: 'Whether this is the primary address for the client'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the address was created'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the address was last updated'
            }
          }
        },
        ClientWithAddresses: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/Client' },
            {
              type: 'object',
              properties: {
                addresses: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Address' },
                  description: 'List of addresses associated with this client'
                }
              }
            }
          ]
        },
        CreateClientRequest: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Full name of the client'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Unique email address of the client'
            },
            phone: {
              type: 'string',
              maxLength: 20,
              description: 'Phone number of the client'
            },
            company: {
              type: 'string',
              maxLength: 255,
              description: 'Company or organization name'
            }
          }
        },
        UpdateClientRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Full name of the client'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Unique email address of the client'
            },
            phone: {
              type: 'string',
              maxLength: 20,
              description: 'Phone number of the client'
            },
            company: {
              type: 'string',
              maxLength: 255,
              description: 'Company or organization name'
            }
          }
        },
        CreateAddressRequest: {
          type: 'object',
          required: ['client_id', 'street', 'city', 'state', 'postal_code'],
          properties: {
            client_id: {
              type: 'string',
              format: 'uuid',
              description: 'Reference to the client this address belongs to'
            },
            street: {
              type: 'string',
              maxLength: 255,
              description: 'Street address'
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'City name'
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'State or province'
            },
            postal_code: {
              type: 'string',
              maxLength: 20,
              description: 'Postal or ZIP code'
            },
            country: {
              type: 'string',
              maxLength: 100,
              default: 'Dominican Republic',
              description: 'Country name'
            },
            is_primary: {
              type: 'boolean',
              default: false,
              description: 'Whether this is the primary address for the client'
            }
          }
        },
        UpdateAddressRequest: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
              maxLength: 255,
              description: 'Street address'
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'City name'
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'State or province'
            },
            postal_code: {
              type: 'string',
              maxLength: 20,
              description: 'Postal or ZIP code'
            },
            country: {
              type: 'string',
              maxLength: 100,
              description: 'Country name'
            },
            is_primary: {
              type: 'boolean',
              description: 'Whether this is the primary address for the client'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              description: 'Response data (varies by endpoint)'
            },
            error: {
              description: 'Error details if operation failed'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Error code'
                },
                details: {
                  type: 'string',
                  description: 'Detailed error information'
                }
              }
            }
          }
        }
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authentication (future implementation)'
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check and system status endpoints'
      },
      {
        name: 'Clients',
        description: 'Client management operations (CRUD)'
      },
      {
        name: 'Addresses',
        description: 'Address management operations for clients'
      },
      {
        name: 'Search',
        description: 'Search and filtering operations'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };


