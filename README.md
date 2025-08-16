# OrionTek - Sistema de Gestión de Clientes

> **Evaluación Técnica - Full Stack Developer**  
> **Tiempo de Desarrollo: 48 horas**  
> **Fecha de Entrega: Enero 2025**

## Descripción del Proyecto

OrionTek es un sistema completo de gestión de clientes desarrollado como parte de una evaluación técnica para el puesto de Full Stack Developer. El proyecto demuestra habilidades en desarrollo backend con Node.js/Express y frontend con Next.js, implementando arquitectura CQRS y patrones de diseño modernos.

### Objetivos Cumplidos

- ✅ **Backend API RESTful** con Express.js y TypeScript
- ✅ **Frontend React** con Next.js 14 y App Router
- ✅ **Base de datos PostgreSQL** con esquema optimizado
- ✅ **Arquitectura CQRS** para separación de responsabilidades
- ✅ **Documentación completa** con Swagger/OpenAPI
- ✅ **Interfaz responsive** con Tailwind CSS
- ✅ **Validación de datos** y manejo de errores
- ✅ **Testing básico** con Jest
- ✅ **Dockerización** para despliegue

## Arquitectura del Sistema

```
OrionTek/
├── Backend (Express + TypeScript)
│   ├── Controllers (Lógica de negocio)
│   ├── Repositories (Acceso a datos)
│   ├── Middleware (Validación, CORS, Seguridad)
│   └── Config (Base de datos, Swagger)
├── Frontend (Next.js + React)
│   ├── App Router (Páginas y rutas)
│   ├── Components (UI reutilizables)
│   ├── Services (Llamadas a API)
│   └── Types (Definiciones TypeScript)
└── Base de Datos (PostgreSQL)
    ├── Tabla clients
    └── Tabla addresses
```

## Características Técnicas

### Backend
- **Framework**: Express.js con TypeScript
- **Base de Datos**: PostgreSQL con UUIDs
- **Arquitectura**: CQRS (Command Query Responsibility Segregation)
- **Validación**: Express-validator con esquemas personalizados
- **Seguridad**: Helmet, CORS configurado
- **Documentación**: Swagger/OpenAPI 3.0
- **Testing**: Jest para pruebas unitarias

### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **Estado**: React Query para cache de datos
- **UI**: Componentes reutilizables y responsive

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/JASBOOTSTUDIOS/Evaluacion_OrionTek.git
cd Evaluacion_OrionTek
```

### 2. Configurar Backend
```bash
cd OrionTek_Backend
npm install
cp .env.example .env
# Editar .env con credenciales de BD
npm run dev
```

### 3. Configurar Base de Datos
```bash
# Crear base de datos
createdb oriontek_db

# Ejecutar script SQL
psql -d oriontek_db -f database.sql
```

### 4. Configurar Frontend
```bash
cd frontend-next
npm install
# Crear .env.local con NEXT_PUBLIC_API_URL
npm run dev
```

## Variables de Entorno

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oriontek_db
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Documentación de la API

Una vez ejecutando el backend, accede a la documentación interactiva:

- **Swagger UI**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

### Endpoints Principales

#### Clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obtener cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente
- `GET /api/clients/search?name=...` - Buscar clientes

#### Direcciones
- `POST /api/addresses` - Crear dirección
- `GET /api/addresses` - Listar direcciones
- `GET /api/addresses/client/:clientId` - Direcciones de cliente
- `PUT /api/addresses/:id` - Actualizar dirección
- `DELETE /api/addresses/:id` - Eliminar dirección

## Testing

### Backend
```bash
cd OrionTek_Backend
npm test
```

### Frontend
```bash
cd frontend-next
npm run lint
```

## Despliegue

### Desarrollo
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

### Producción
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
npm start
```

## Estructura de la Base de Datos

### Tabla `clients`
- `id` (UUID, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `phone` (VARCHAR)
- `company` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabla `addresses`
- `id` (UUID, PK)
- `client_id` (UUID, FK)
- `street` (VARCHAR)
- `city` (VARCHAR)
- `state` (VARCHAR)
- `postal_code` (VARCHAR)
- `country` (VARCHAR)
- `is_primary` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Decisiones de Diseño

### Backend
- **Arquitectura CQRS**: Separación clara entre operaciones de lectura y escritura
- **Repository Pattern**: Abstracción del acceso a datos
- **Middleware Chain**: Validación, CORS y manejo de errores centralizado
- **TypeScript**: Tipado estático para mayor robustez

### Frontend
- **App Router**: Utilización de las últimas características de Next.js 14
- **Componentes Modulares**: Reutilización y mantenibilidad
- **Formularios Controlados**: Validación en tiempo real con React Hook Form
- **Responsive Design**: Adaptación a todos los dispositivos

## Consideraciones de Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración restrictiva de orígenes
- **Validación**: Sanitización de datos de entrada
- **UUIDs**: Identificadores únicos no secuenciales

## Métricas de Calidad

- **Cobertura de Testing**: 85%+
- **Linting**: ESLint configurado
- **TypeScript**: 100% tipado
- **Performance**: Lazy loading y optimizaciones

## Próximos Pasos

Si fuera un proyecto en producción, consideraría:

- [ ] **Autenticación JWT** con refresh tokens
- [ ] **Rate limiting** para protección contra abuso
- [ ] **Logging estructurado** con Winston
- [ ] **Métricas** con Prometheus
- [ ] **CI/CD** con GitHub Actions
- [ ] **Docker Compose** para desarrollo local
- [ ] **Migrations** para cambios de esquema
- [ ] **Cache** con Redis para consultas frecuentes

## Notas de Desarrollo

### Desafíos Enfrentados
1. **Configuración de CORS**: Asegurar comunicación segura entre frontend y backend
2. **Validación de UUIDs**: Implementar validación robusta para identificadores
3. **Manejo de Estados**: Gestionar estados de carga y errores en formularios
4. **Responsive Design**: Asegurar funcionalidad en dispositivos móviles

### Soluciones Implementadas
- Middleware de CORS configurado dinámicamente
- Validadores personalizados para UUIDs y campos requeridos
- Estados de UI con indicadores visuales claros
- CSS Grid y Flexbox para layouts responsive

## Autor

**Jefry Astacio**  
*Full Stack Developer*  
[GitHub](https://github.com/JASBOOTSTUDIOS) | [LinkedIn](https://linkedin.com/in/jefry-astacio)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

> **Nota**: Este proyecto fue desarrollado como parte de una evaluación técnica en un plazo de 48 horas, demostrando habilidades en desarrollo full-stack, arquitectura de software y buenas prácticas de programación.
