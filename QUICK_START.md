# 🚀 Inicio Rápido - OrionTek

> **Guía de instalación y ejecución en 5 minutos**

## ⚡ Instalación Express

### 1. Prerrequisitos
```bash
# Asegúrate de tener instalado:
# - Node.js 18+
# - PostgreSQL 12+
# - npm o yarn
```

### 2. Clonar y Configurar
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/oriontek.git
cd oriontek

# Backend
cd OrionTek_Backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de BD

# Frontend
cd ../frontend-next
npm install
# Crear .env.local con NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Base de Datos
```bash
# Crear base de datos
createdb oriontek_db

# Ejecutar schema
psql -d oriontek_db -f ../OrionTek_Backend/database.sql
```

### 4. Ejecutar
```bash
# Terminal 1 - Backend
cd OrionTek_Backend
npm run dev

# Terminal 2 - Frontend
cd frontend-next
npm run dev
```

### 5. Acceder
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentación**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## 🔧 Configuración Rápida

### Variables de Entorno Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oriontek_db
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Variables de Entorno Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📱 Funcionalidades Principales

### ✅ Clientes
- Crear, editar, eliminar clientes
- Búsqueda por nombre
- Validación de campos

### ✅ Direcciones
- Múltiples direcciones por cliente
- Dirección principal
- Validación de formato

### ✅ API REST
- Endpoints completos
- Documentación Swagger
- Validación de datos

## 🐛 Solución de Problemas

### Error de Conexión a BD
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql status

# Verificar credenciales en .env
psql -h localhost -U postgres -d oriontek_db
```

### Error de CORS
```bash
# Verificar que CORS_ORIGIN en .env coincida con la URL del frontend
CORS_ORIGIN=http://localhost:3000
```

### Puerto en Uso
```bash
# Cambiar puerto en .env
PORT=3002

# O matar proceso que use el puerto
lsof -ti:3001 | xargs kill -9
```

## 🧪 Testing Rápido

### Backend
```bash
cd OrionTek_Backend
npm test
```

### Frontend
```bash
cd frontend-next
npm run lint
npm run build
```

## 📊 Verificar Funcionamiento

### 1. Health Check
```bash
curl http://localhost:3001/health
# Debe devolver: {"status":"OK","timestamp":"..."}
```

### 2. Crear Cliente
```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

### 3. Listar Clientes
```bash
curl http://localhost:3001/api/clients
```

## 🚀 Despliegue Rápido

### Docker (Opcional)
```bash
# Si tienes Docker instalado
docker-compose up -d
```

### Producción
```bash
# Backend
cd OrionTek_Backend
npm run build
npm start

# Frontend
cd frontend-next
npm run build
npm start
```

## 📚 Recursos Adicionales

- **README Principal**: [README.md](README.md)
- **Documentación Técnica**: [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
- **Backend**: [OrionTek_Backend/README.md](OrionTek_Backend/README.md)
- **Frontend**: [frontend-next/README.md](frontend-next/README.md)

## 🆘 Soporte

Si tienes problemas:

1. **Verificar logs** en la consola
2. **Revisar variables de entorno**
3. **Verificar conexión a base de datos**
4. **Revisar documentación técnica**

---

> **¡Listo!** Tu sistema OrionTek debería estar funcionando en http://localhost:3000
