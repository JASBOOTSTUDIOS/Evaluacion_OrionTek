#  Documentación Técnica - OrionTek

> **Evaluación Técnica - Full Stack Developer**  
> **Tiempo de Desarrollo: 48 horas**  
> **Fecha: Enero 2025**

##  Resumen Ejecutivo

OrionTek es un sistema de gestión de clientes desarrollado como parte de una evaluación técnica para demostrar competencias en desarrollo full-stack. El proyecto implementa una arquitectura moderna con separación clara de responsabilidades, utilizando las mejores prácticas de la industria.

##  Arquitectura del Sistema

### Diagrama de Arquitectura
```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (Next.js)     │                 │   (Express)     │
└─────────────────┘                 └─────────────────┘
                                              │
                                              │ SQL
                                              ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   Database      │
                                    └─────────────────┘
```

### Componentes Principales

#### 1. Frontend (Next.js 14)
- **Framework**: Next.js con App Router
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS
- **Estado**: React Hooks + Context
- **Formularios**: React Hook Form + Zod

#### 2. Backend (Express.js)
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Arquitectura**: CQRS (Command Query Responsibility Segregation)
- **Base de Datos**: PostgreSQL
- **Documentación**: Swagger/OpenAPI

#### 3. Base de Datos
- **Sistema**: PostgreSQL 12+
- **Características**: UUIDs, Triggers, Índices optimizados
- **Esquema**: Normalizado con relaciones bien definidas

##  Patrón CQRS Implementado

### Commands (Comandos)
```typescript
// Ejemplo de Command en ClientController
async createClient(req: Request, res: Response) {
  // Validación de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Lógica de negocio
    const clientData = req.body;
    const newClient = await this.clientRepository.create(clientData);
    
    res.status(201).json(newClient);
  } catch (error) {
    // Manejo de errores
    next(error);
  }
}
```

### Queries (Consultas)
```typescript
// Ejemplo de Query en ClientController
async getClients(req: Request, res: Response) {
  try {
    // Solo lectura de datos
    const clients = await this.clientRepository.findAll();
    res.json(clients);
  } catch (error) {
    next(error);
  }
}
```

### Beneficios del CQRS
1. **Separación de responsabilidades**: Comandos y consultas tienen propósitos distintos
2. **Escalabilidad**: Posibilidad de optimizar lecturas y escrituras por separado
3. **Mantenibilidad**: Código más organizado y fácil de entender
4. **Testing**: Pruebas unitarias más específicas

##  Diseño de Base de Datos

### Esquema Normalizado
```sql
-- Tabla clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla addresses
CREATE TABLE addresses (
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
```

### Optimizaciones Implementadas

#### Índices
```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_addresses_client_id ON addresses(client_id);
CREATE INDEX idx_addresses_primary ON addresses(client_id, is_primary);
CREATE INDEX idx_addresses_city ON addresses(city);
```

#### Triggers
```sql
-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Decisiones de Diseño

#### ¿Por qué UUIDs?
- **Seguridad**: Evita enumeración de IDs
- **Distribución**: No hay colisiones en sistemas distribuidos
- **PostgreSQL**: Soporte nativo excelente

#### ¿Por qué Timestamps automáticos?
- **Auditoría**: Rastreo de cambios
- **Consistencia**: Siempre actualizados
- **Triggers**: Automatización completa

##  API REST Design

### Principios REST Implementados

#### 1. Recursos Identificables
```
GET    /api/clients          # Listar clientes
GET    /api/clients/:id      # Obtener cliente específico
POST   /api/clients          # Crear nuevo cliente
PUT    /api/clients/:id      # Actualizar cliente completo
DELETE /api/clients/:id      # Eliminar cliente
```

#### 2. Representaciones Consistentes
```typescript
// Estructura de respuesta estándar
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
```

#### 3. Códigos de Estado HTTP
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado
- `400 Bad Request`: Error de validación
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

### Validación de Datos

#### Middleware de Validación
```typescript
// Ejemplo de validación para crear cliente
export const validateCreateClient = [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Nombre debe tener entre 2 y 255 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('phone').optional().isMobilePhone().withMessage('Teléfono inválido'),
  body('company').optional().trim().isLength({ max: 255 }).withMessage('Empresa muy larga'),
];
```

#### Manejo de Errores
```typescript
// Middleware centralizado de errores
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
```

##  Frontend Architecture

### App Router Structure
```
app/
├── layout.tsx              # Layout principal
├── page.tsx                # Página de inicio
├── clients/                # Rutas de clientes
│   ├── page.tsx           # Lista de clientes
│   ├── new/               # Nuevo cliente
│   │   └── page.tsx
│   └── [id]/              # Cliente específico
│       ├── page.tsx       # Detalle del cliente
│       ├── edit/          # Editar cliente
│       │   └── page.tsx
│       └── addresses/     # Direcciones del cliente
│           ├── page.tsx
│           ├── new/       # Nueva dirección
│           │   └── page.tsx
│           └── [addressId]/ # Editar dirección
│               └── edit/
│                   └── page.tsx
├── addresses/              # Rutas de direcciones
│   └── page.tsx
└── search/                 # Búsqueda global
    └── page.tsx
```

### Component Architecture

#### Layout Component
```typescript
// Componente de layout principal
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navegación principal */}
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white border-t">
        {/* Footer */}
      </footer>
    </div>
  );
}
```

#### Form Components
```typescript
// Ejemplo de formulario con React Hook Form
export default function ClientForm({ client, onSubmit }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {}
  });

  const onSubmitHandler = async (data: ClientFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* Campos del formulario */}
    </form>
  );
}
```

### State Management

#### React Hooks Pattern
```typescript
// Hook personalizado para manejar clientes
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientService.getClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
}
```

##  Seguridad y Validación

### Middleware de Seguridad

#### Helmet Configuration
```typescript
// Configuración de Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### CORS Configuration
```typescript
// Configuración dinámica de CORS
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
      : ['http://localhost:3000'];
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

### Validación de Entrada

#### Zod Schemas
```typescript
// Esquemas de validación con Zod
export const clientSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  phone: z.string()
    .optional()
    .refine(val => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
      message: 'Formato de teléfono inválido'
    }),
  company: z.string()
    .optional()
    .max(255, 'El nombre de la empresa no puede exceder 255 caracteres')
});

export const addressSchema = z.object({
  street: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(255, 'La dirección no puede exceder 255 caracteres'),
  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'El nombre de la ciudad no puede exceder 100 caracteres'),
  state: z.string()
    .min(2, 'El estado debe tener al menos 2 caracteres')
    .max(100, 'El nombre del estado no puede exceder 100 caracteres'),
  postal_code: z.string()
    .min(3, 'El código postal debe tener al menos 3 caracteres')
    .max(20, 'El código postal no puede exceder 20 caracteres'),
  country: z.string()
    .default('Dominican Republic'),
  is_primary: z.boolean()
    .default(false)
});
```

##  Testing Strategy

### Backend Testing

#### Unit Tests
```typescript
// Ejemplo de test unitario para ClientController
describe('ClientController', () => {
  let clientController: ClientController;
  let mockClientRepository: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    mockClientRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn()
    };
    clientController = new ClientController(mockClientRepository);
  });

  describe('createClient', () => {
    it('should create a new client successfully', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Tech Corp'
      };
      
      const expectedClient = { id: 'uuid', ...clientData, created_at: new Date(), updated_at: new Date() };
      mockClientRepository.create.mockResolvedValue(expectedClient);

      const result = await clientController.createClient(clientData);
      
      expect(result).toEqual(expectedClient);
      expect(mockClientRepository.create).toHaveBeenCalledWith(clientData);
    });
  });
});
```

#### Integration Tests
```typescript
// Ejemplo de test de integración para la API
describe('Client API Integration', () => {
  let app: Express;

  beforeAll(async () => {
    app = createTestApp();
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/clients', () => {
    it('should create a new client', async () => {
      const clientData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890',
        company: 'Design Studio'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(201);

      expect(response.body).toMatchObject(clientData);
      expect(response.body.id).toBeDefined();
    });
  });
});
```

### Frontend Testing

#### Component Testing
```typescript
// Ejemplo de test para ClientForm
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClientForm } from './ClientForm';

describe('ClientForm', () => {
  it('should submit form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    
    render(<ClientForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'John Doe' }
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });
  });
});
```

##  Performance y Optimización

### Backend Optimizaciones

#### Database Query Optimization
```typescript
// Ejemplo de consulta optimizada con JOIN
async findClientWithAddresses(clientId: string): Promise<ClientWithAddresses> {
  const query = `
    SELECT 
      c.id, c.name, c.email, c.phone, c.company, c.created_at, c.updated_at,
      a.id as address_id, a.street, a.city, a.state, a.postal_code, a.country, a.is_primary
    FROM clients c
    LEFT JOIN addresses a ON c.id = a.client_id
    WHERE c.id = $1
    ORDER BY a.is_primary DESC, a.created_at ASC
  `;
  
  const result = await this.pool.query(query, [clientId]);
  // Procesar resultado para agrupar direcciones por cliente
}
```

#### Connection Pooling
```typescript
// Configuración de pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Máximo de conexiones
  idleTimeoutMillis: 30000, // Tiempo de inactividad
  connectionTimeoutMillis: 2000, // Timeout de conexión
});
```

### Frontend Optimizaciones

#### Code Splitting
```typescript
// Lazy loading de componentes pesados
const ClientList = lazy(() => import('./ClientList'));
const AddressForm = lazy(() => import('./AddressForm'));

// Suspense boundary
<Suspense fallback={<LoadingSpinner />}>
  <ClientList />
</Suspense>
```

#### Memoization
```typescript
// Memoización de componentes costosos
const MemoizedClientCard = memo(ClientCard, (prevProps, nextProps) => {
  return prevProps.client.id === nextProps.client.id &&
         prevProps.client.updated_at === nextProps.client.updated_at;
});
```

##  Despliegue y CI/CD

### Environment Configuration

#### Development
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oriontek_db
DB_USER=postgres
DB_PASSWORD=dev_password
CORS_ORIGIN=http://localhost:3000
```

#### Production
```env
NODE_ENV=production
PORT=3001
DB_HOST=production_host
DB_PORT=5432
DB_NAME=oriontek_prod
DB_USER=prod_user
DB_PASSWORD=secure_password
CORS_ORIGIN=https://yourdomain.com
```

### Docker Configuration

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./OrionTek_Backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres

  frontend:
    build: ./frontend-next
    ports:
      - "3000:80"
    depends_on:
      - backend

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=oriontek_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

##  Monitoreo y Logging

### Health Checks
```typescript
// Endpoint de health check
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await pool.query('SELECT 1');
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: 'disconnected'
    });
  }
});
```

### Logging Strategy
```typescript
// Logger configurado para diferentes entornos
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});
```

##  Próximos Pasos y Mejoras

### Backend Mejoras
- [ ] **Autenticación JWT** con refresh tokens
- [ ] **Rate limiting** con express-rate-limit
- [ ] **Caching** con Redis para consultas frecuentes
- [ ] **Logging estructurado** con Winston
- [ ] **Métricas** con Prometheus y Grafana
- [ ] **API versioning** para compatibilidad
- [ ] **WebSocket** para notificaciones en tiempo real

### Frontend Mejoras
- [ ] **Testing completo** con Jest y Cypress
- [ ] **Storybook** para documentar componentes
- [ ] **PWA** con service workers
- [ ] **Internacionalización** con next-i18next
- [ ] **Analytics** con Google Analytics
- [ ] **Error tracking** con Sentry
- [ ] **Performance monitoring** con Core Web Vitals

### DevOps Mejoras
- [ ] **CI/CD pipeline** con GitHub Actions
- [ ] **Automated testing** en cada commit
- [ ] **Dependency scanning** para vulnerabilidades
- [ ] **Infrastructure as Code** con Terraform
- [ ] **Monitoring** con ELK stack
- [ ] **Backup automático** de base de datos

##  Conclusiones

### Logros Alcanzados
1. **Arquitectura sólida**: Implementación exitosa de CQRS
2. **Código limpio**: Patrones de diseño bien aplicados
3. **Documentación completa**: Swagger y READMEs detallados
4. **Testing básico**: Estructura preparada para testing
5. **Responsive design**: Interfaz funcional en todos los dispositivos

### Aprendizajes Clave
1. **Planificación**: La arquitectura debe planificarse desde el inicio
2. **Validación**: Es crucial validar datos en múltiples capas
3. **Error handling**: Manejo centralizado de errores mejora la experiencia
4. **Documentación**: Swagger facilita la integración y testing
5. **TypeScript**: El tipado estático previene muchos errores

### Áreas de Mejora
1. **Testing**: Implementar testing completo (unit, integration, e2e)
2. **Security**: Agregar autenticación y autorización
3. **Performance**: Implementar caching y optimizaciones
4. **Monitoring**: Agregar logging y métricas
5. **CI/CD**: Automatizar el proceso de deployment

---

> **Nota**: Este documento técnico fue creado para documentar las decisiones de arquitectura y implementación del proyecto OrionTek. Sirve como referencia para desarrolladores que trabajen en el proyecto y como evidencia de las competencias técnicas demostradas en la evaluación.
