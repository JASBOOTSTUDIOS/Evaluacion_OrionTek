# Quick Start - OrionTek

> **Guía rápida de instalación y ejecución**  
> **Para desarrolladores que quieren probar el proyecto**  
> **Tiempo estimado: 10-15 minutos**

## Prerrequisitos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** 18+ (recomiendo la LTS)
- **PostgreSQL** 12+ (con acceso de superusuario)
- **Git** para clonar el repositorio
- **npm** o **yarn** como gestor de paquetes

## Clonar y Configurar

### 1. Clonar el repositorio
```bash
git clone https://github.com/JASBOOTSTUDIOS/Evaluacion_OrionTek.git
cd Evaluacion_OrionTek
```

### 2. Configurar variables de entorno
```bash
# Backend
cd OrionTek_Backend
cp .env.example .env
# Editar .env con tus credenciales de BD

# Frontend
cd ../frontend-next
# Crear .env.local con NEXT_PUBLIC_API_URL
```

## Configuración de Base de Datos

### 1. Crear la base de datos
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear BD
CREATE DATABASE oriontek_db;
\q
```

### 2. Ejecutar el script SQL
```bash
# Desde el directorio raíz del proyecto
psql -U postgres -d oriontek_db -f database.sql
```

## Ejecutar el Proyecto

### 1. Backend
```bash
cd OrionTek_Backend
npm install
npm run dev
# El backend estará en http://localhost:3001
```

### 2. Frontend
```bash
cd frontend-next
npm install
npm run dev
# El frontend estará en http://localhost:3000
```

## Acceso Rápido

Una vez ejecutando ambos servicios:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentación Swagger**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## Configuración Rápida de Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oriontek_db
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Funcionalidades Principales

### Clientes
- ✅ Crear, leer, actualizar y eliminar clientes
- ✅ Búsqueda por nombre o email
- ✅ Validación de datos en tiempo real
- ✅ Interfaz responsive

### Direcciones
- ✅ Gestionar múltiples direcciones por cliente
- ✅ Marcar dirección como principal
- ✅ Validación de campos requeridos
- ✅ Relación cliente-dirección

### Sistema
- ✅ Dashboard con estadísticas
- ✅ Navegación intuitiva
- ✅ Manejo de errores
- ✅ Loading states

## Troubleshooting Rápido

### Error de conexión a BD
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar credenciales
psql -U postgres -d oriontek_db -c "SELECT 1;"
```

### Error de CORS
```bash
# Verificar que CORS_ORIGIN en .env coincida con la URL del frontend
# Debe ser exactamente: http://localhost:3000
```

### Puerto ocupado
```bash
# Cambiar puerto en .env del backend
PORT=3002

# Y actualizar .env.local del frontend
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## Testing Rápido

### Backend
```bash
cd OrionTek_Backend
npm test
```

### Frontend
```bash
cd frontend-next
npm run lint
npm run type-check
```

## Despliegue Rápido (Docker)

Si prefieres usar Docker:

```bash
# Desde el directorio raíz
docker-compose up -d

# Esto levantará:
# - PostgreSQL en puerto 5432
# - Backend en puerto 3001
# - Frontend en puerto 3000
```

## Recursos Adicionales

- **README Principal**: [README.md](README.md)
- **Documentación Técnica**: [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
- **Backend README**: [OrionTek_Backend/README.md](OrionTek_Backend/README.md)
- **Frontend README**: [frontend-next/README.md](frontend-next/README.md)

## Comandos Útiles

### Desarrollo
```bash
# Backend en modo watch
npm run dev

# Frontend en modo watch
npm run dev

# Build de producción
npm run build
```

### Base de Datos
```bash
# Conectarse a BD
psql -U postgres -d oriontek_db

# Ver tablas
\dt

# Ver estructura de tabla
\d clients
\d addresses
```

### Git
```bash
# Ver estado
git status

# Ver commits
git log --oneline

# Ver ramas
git branch -a
```

## ¿Necesitas Ayuda?

Si encuentras algún problema:

1. **Revisa los logs** del backend y frontend
2. **Verifica las variables** de entorno
3. **Comprueba la conexión** a la base de datos
4. **Revisa la documentación** técnica
5. **Abre un issue** en GitHub

---

> **Nota**: Esta guía está diseñada para que puedas tener el proyecto funcionando en menos de 15 minutos. Si tienes experiencia con Node.js y PostgreSQL, debería ser aún más rápido.

## Autor

**Jefry Astacio**  
*Full Stack Developer*  
[GitHub](https://github.com/JASBOOTSTUDIOS) | [LinkedIn](https://linkedin.com/in/jefry-astacio)

## Repositorio

**URL**: https://github.com/JASBOOTSTUDIOS/Evaluacion_OrionTek.git
