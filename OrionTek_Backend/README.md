# 🖥️ OrionTek Backend API

> **Backend del Sistema de Gestión de Clientes**  
> **Desarrollado en 48 horas para evaluación técnica**  
> **Stack: Node.js + Express + TypeScript + PostgreSQL**

## 🎯 ¿Qué es esto?

Este es el backend de OrionTek, un sistema de gestión de clientes que desarrollé como parte de una evaluación técnica. La idea era demostrar que puedo construir APIs robustas con arquitectura limpia y buenas prácticas.

### 💡 ¿Por qué esta arquitectura?

- **CQRS**: Me gusta la separación clara entre comandos y consultas. Hace el código más mantenible
- **TypeScript**: Para evitar errores en runtime y tener mejor DX
- **PostgreSQL**: Porque es robusto y maneja bien los UUIDs
- **Swagger**: Para que otros desarrolladores puedan entender la API fácilmente

## 🚀 Características Implementadas

- ✅ **API RESTful completa** - CRUD para clientes y direcciones
- ✅ **Arquitectura CQRS** - Separación de responsabilidades
- ✅ **Base de datos PostgreSQL** - Con triggers y índices optimizados
- ✅ **Validación robusta** - Con express-validator y esquemas personalizados
- ✅ **Manejo de errores centralizado** - Middleware que captura todo
- ✅ **Documentación Swagger** - Interactiva y completa
- ✅ **Seguridad básica** - Helmet + CORS configurado
- ✅ **Testing con Jest** - Para asegurar calidad

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL 12+
- **ORM**: pg (cliente nativo)
- **Validación**: express-validator
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Seguridad**: Helmet, CORS

## 📦 Instalación

### 1. Dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env
# Editar con tus credenciales de BD
```

### 3. Base de datos
```bash
# Crear BD
createdb oriontek_db

# Ejecutar schema
psql -d oriontek_db -f database.sql
```

### 4. Ejecutar
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🗄️ Estructura de la Base de Datos

### Tabla `clients`
```sql
id UUID PRIMARY KEY          -- Identificador único
name VARCHAR(255) NOT NULL   -- Nombre del cliente
email VARCHAR(255) UNIQUE    -- Email único
phone VARCHAR(20)            -- Teléfono
company VARCHAR(255)         -- Empresa
created_at TIMESTAMP         -- Fecha creación
updated_at TIMESTAMP         -- Fecha actualización
```

### Tabla `addresses`
```sql
id UUID PRIMARY KEY          -- Identificador único
client_id UUID NOT NULL      -- Referencia al cliente
street VARCHAR(255)          -- Calle
city VARCHAR(100)            -- Ciudad
state VARCHAR(100)           -- Estado
postal_code VARCHAR(20)      -- Código postal
country VARCHAR(100)         -- País (default: DR)
is_primary BOOLEAN           -- Si es dirección principal
created_at TIMESTAMP         -- Fecha creación
updated_at TIMESTAMP         -- Fecha actualización
```

### 🔍 Índices y Optimizaciones
- Índice en `clients.email` para búsquedas rápidas
- Índice en `clients.name` para búsquedas por nombre
- Índice compuesto en `addresses(client_id, is_primary)` para dirección principal
- Trigger automático para `updated_at`

## 📚 Endpoints de la API

### Clientes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/clients` | Crear nuevo cliente |
| `GET` | `/api/clients` | Listar todos los clientes |
| `GET` | `/api/clients/:id` | Obtener cliente por ID |
| `PUT` | `/api/clients/:id` | Actualizar cliente |
| `DELETE` | `/api/clients/:id` | Eliminar cliente |
| `GET` | `/api/clients/search?name=...` | Buscar por nombre |

### Direcciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/addresses` | Crear nueva dirección |
| `GET` | `/api/addresses` | Listar todas las direcciones |
| `GET` | `/api/addresses/:id` | Obtener dirección por ID |
| `PUT` | `/api/addresses/:id` | Actualizar dirección |
| `DELETE` | `/api/addresses/:id` | Eliminar dirección |
| `GET` | `/api/addresses/client/:clientId` | Direcciones de un cliente |

### Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api-docs` | Documentación Swagger |

## 🏗️ Arquitectura del Código

```
src/
├── config/           # Configuraciones (DB, Swagger)
├── controllers/      # Lógica de negocio
├── repositories/     # Acceso a datos
├── middleware/       # Middlewares (validación, errores)
├── routes/          # Definición de rutas
├── types/           # Tipos TypeScript
└── index.ts         # Punto de entrada
```

### 🔄 Flujo de una Request
1. **Request** llega a una ruta
2. **Middleware** de validación procesa los datos
3. **Controller** ejecuta la lógica de negocio
4. **Repository** interactúa con la base de datos
5. **Response** se envía al cliente

## 🔧 Configuración

### Variables de Entorno
```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oriontek_db
DB_USER=postgres
DB_PASSWORD=tu_password

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### CORS
Configuré CORS para permitir solo orígenes específicos. En desarrollo permite `localhost:3000`, en producción deberías configurar solo tu dominio.

## 🧪 Testing

```bash
npm test
```

Por ahora solo tengo tests básicos, pero en un proyecto real implementaría:
- Tests unitarios para cada función
- Tests de integración para la API
- Tests de base de datos con datos de prueba
- Coverage mínimo del 80%

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
# http://localhost:3001
```

### Producción
```bash
npm run build
npm start
```

### Docker (opcional)
```bash
docker build -t oriontek-backend .
docker run -p 3001:3001 oriontek-backend
```

## 📊 Documentación

Una vez ejecutando, accede a:
- **Swagger UI**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

La documentación Swagger incluye:
- Todos los endpoints con ejemplos
- Esquemas de request/response
- Códigos de error
- Posibilidad de probar la API directamente

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Orígenes permitidos configurados
- **Validación**: Sanitización de datos de entrada
- **UUIDs**: IDs no secuenciales para evitar enumeración

## 💭 Decisiones de Diseño

### ¿Por qué CQRS?
Aunque es un proyecto pequeño, quise demostrar que entiendo patrones de arquitectura. CQRS separa las operaciones de lectura y escritura, lo que facilita:
- Optimización independiente de cada operación
- Escalabilidad horizontal
- Testing más fácil
- Mantenimiento del código

### ¿Por qué TypeScript?
- Detección temprana de errores
- Mejor autocompletado en el IDE
- Documentación viva del código
- Refactoring más seguro

### ¿Por qué PostgreSQL?
- Soporte nativo para UUIDs
- Triggers y funciones personalizadas
- Índices avanzados
- ACID compliance

## 🐛 Problemas que Enfrenté

1. **Configuración de CORS**: Tuve que investigar cómo configurar CORS dinámicamente
2. **Validación de UUIDs**: Creé validadores personalizados para asegurar formato correcto
3. **Manejo de errores**: Implementé un middleware centralizado para capturar todos los errores
4. **Triggers de BD**: Configuré triggers para actualizar automáticamente `updated_at`

## 📈 Próximos Pasos (si fuera producción)

- [ ] **Autenticación JWT** con refresh tokens
- [ ] **Rate limiting** para prevenir abuso
- [ ] **Logging** con Winston o Pino
- [ ] **Métricas** con Prometheus
- [ ] **Cache** con Redis
- [ ] **Migrations** para cambios de esquema
- [ ] **CI/CD** con GitHub Actions
- [ ] **Docker Compose** para desarrollo

## 🤝 Contribución

Si quieres contribuir:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - Haz lo que quieras con el código.

## 👨‍💻 Sobre mí

Soy un desarrollador full-stack que le gusta escribir código limpio y bien estructurado. Este proyecto es parte de mi portafolio y demuestra mis habilidades en:

- Arquitectura de software
- APIs RESTful
- Bases de datos relacionales
- TypeScript y Node.js
- Testing y documentación

---

> **Nota**: Este proyecto fue desarrollado en 48 horas para una evaluación técnica. Aunque es funcional, en un entorno de producción implementaría más validaciones, testing y seguridad.

## 📞 Contacto

- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **LinkedIn**: [Tu Nombre](https://linkedin.com/in/tu-usuario)
- **Email**: tu-email@ejemplo.com
