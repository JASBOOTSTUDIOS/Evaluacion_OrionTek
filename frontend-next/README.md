# 🎨 OrionTek Frontend - Next.js

> **Frontend del Sistema de Gestión de Clientes**  
> **Desarrollado en 48 horas para evaluación técnica**  
> **Stack: Next.js 14 + React + TypeScript + Tailwind CSS**

## 🎯 ¿Qué es esto?

Este es el frontend de OrionTek, la interfaz de usuario que desarrollé para el sistema de gestión de clientes. Quería demostrar que puedo crear interfaces modernas, responsive y con buena UX usando las últimas tecnologías.

### 💡 ¿Por qué Next.js 14?

- **App Router**: Me gusta la nueva arquitectura de Next.js, es más intuitiva
- **React 19**: Para usar las últimas características de React
- **TypeScript**: Para evitar errores y tener mejor DX
- **Tailwind CSS**: Para desarrollo rápido y consistente

## 🚀 Características Implementadas

- ✅ **Next.js 14 con App Router** - Arquitectura moderna y eficiente
- ✅ **React 19** - Con hooks y componentes funcionales
- ✅ **TypeScript completo** - 100% tipado
- ✅ **Tailwind CSS** - Diseño responsive y moderno
- ✅ **Formularios inteligentes** - React Hook Form + Zod
- ✅ **Componentes reutilizables** - Arquitectura modular
- ✅ **Integración con API** - Comunicación con backend Express
- ✅ **Responsive design** - Funciona en todos los dispositivos

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14
- **Lenguaje**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Iconos**: Lucide React
- **Utilidades**: clsx, date-fns, tailwind-merge

## 📦 Instalación

### 1. Dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
# Crear .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Ejecutar
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── clients/           # Páginas de clientes
│   │   ├── [id]/          # Cliente específico
│   │   │   ├── edit/      # Editar cliente
│   │   │   └── addresses/ # Direcciones del cliente
│   │   ├── new/           # Nuevo cliente
│   │   └── page.tsx       # Lista de clientes
│   ├── addresses/         # Páginas de direcciones
│   ├── search/            # Búsqueda global
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   └── Layout.tsx         # Layout con navegación
├── services/              # Servicios de API
│   ├── api.ts            # Configuración de Axios
│   ├── clientService.ts  # Operaciones de clientes
│   └── addressService.ts # Operaciones de direcciones
└── types/                 # Tipos TypeScript
    └── index.ts           # Definiciones de tipos
```

## 📱 Páginas Disponibles

### 🏠 Página Principal (`/`)
- Dashboard con estadísticas del sistema
- Acciones rápidas para operaciones comunes
- Características principales destacadas
- Diseño hero con call-to-action

### 👥 Clientes (`/clients`)
- Lista paginada de todos los clientes
- Búsqueda y filtrado en tiempo real
- Acciones CRUD para cada cliente
- Diseño de tarjetas responsive

### ➕ Nuevo Cliente (`/clients/new`)
- Formulario de creación con validación
- Campos requeridos y opcionales
- Redirección automática tras creación
- Manejo de errores en tiempo real

### ✏️ Editar Cliente (`/clients/[id]/edit`)
- Formulario pre-poblado con datos existentes
- Validación de campos
- Actualización en tiempo real
- Confirmación de cambios

### 👤 Detalle de Cliente (`/clients/[id]`)
- Información completa del cliente
- Lista de direcciones asociadas
- Acciones de gestión (editar, eliminar)
- Navegación a direcciones

### 🏠 Direcciones (`/clients/[id]/addresses`)
- Gestión de direcciones por cliente
- Crear, editar y eliminar direcciones
- Marcar dirección como principal
- Validación de campos de dirección

### 🔍 Búsqueda (`/search`)
- Búsqueda global en clientes y direcciones
- Filtros avanzados
- Resultados en tiempo real
- Historial de búsquedas

## 🎨 Componentes

### Layout Principal
- Header con navegación principal
- Navegación activa con indicadores
- Footer con información del sistema
- Responsive para móviles

### Formularios
- **React Hook Form**: Para manejo eficiente de estado
- **Zod**: Para validación de esquemas
- **Estados de carga**: Indicadores visuales
- **Manejo de errores**: Mensajes claros y contextuales

### Tarjetas y Listas
- Diseño responsive con CSS Grid
- Acciones contextuales por elemento
- Información organizada y legible
- Hover effects y transiciones

### Navegación
- Breadcrumbs para orientación
- Menús desplegables
- Navegación móvil optimizada
- Indicadores de página activa

## 🔌 Servicios de API

### ClientService
```typescript
// Operaciones CRUD completas
createClient(data: CreateClientData): Promise<Client>
getClients(): Promise<Client[]>
getClient(id: string): Promise<Client>
updateClient(id: string, data: UpdateClientData): Promise<Client>
deleteClient(id: string): Promise<void>
searchClients(query: string): Promise<Client[]>
```

### AddressService
```typescript
// Gestión de direcciones
createAddress(data: CreateAddressData): Promise<Address>
getAddresses(): Promise<Address[]>
getAddressesByClient(clientId: string): Promise<Address[]>
updateAddress(id: string, data: UpdateAddressData): Promise<Address>
deleteAddress(id: string): Promise<void>
setPrimaryAddress(id: string): Promise<void>
```

## 🎯 Decisiones de Diseño

### ¿Por qué App Router?
- **Rutas anidadas**: Más intuitivo para organizar páginas
- **Layouts compartidos**: Reutilización de componentes
- **Loading states**: Mejor UX con suspense
- **Server Components**: Mejor performance

### ¿Por qué Tailwind CSS?
- **Desarrollo rápido**: No necesito escribir CSS personalizado
- **Consistencia**: Sistema de diseño coherente
- **Responsive**: Utilities para todos los breakpoints
- **Customizable**: Fácil de extender

### ¿Por qué React Hook Form?
- **Performance**: Re-renders mínimos
- **Validación**: Integración con Zod
- **Accesibilidad**: Manejo automático de labels
- **TypeScript**: Tipado completo

## 🔧 Configuración

### Variables de Entorno
```env
# URL de la API backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Next.js Config
```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',
    },
  ];
}
```

### Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
}
```

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
# http://localhost:3000
```

### Producción
```bash
npm run build
npm start
```

### Vercel (Recomendado)
```bash
npm run build
# Desplegar en Vercel
```

## 🔒 Seguridad y Validación

- **Validación de entrada**: Zod schemas para todos los formularios
- **Sanitización**: Limpieza de datos antes de enviar
- **CORS**: Configurado en backend
- **TypeScript**: Prevención de errores en runtime

## 📊 Performance

- **Lazy loading**: Componentes cargados bajo demanda
- **Image optimization**: Next.js Image component
- **Bundle splitting**: Automático con Next.js
- **SSR/SSG**: Cuando sea posible
- **Code splitting**: Por rutas automático

## 🧪 Testing y Calidad

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build check
npm run build
```

En un proyecto real implementaría:
- **Jest + Testing Library**: Para tests unitarios
- **Cypress**: Para tests E2E
- **Storybook**: Para documentar componentes
- **Coverage**: Mínimo 80%

## 🐛 Problemas que Enfrenté

1. **Integración con API**: Tuve que configurar CORS y manejar errores de red
2. **Formularios complejos**: Implementar validación en tiempo real con React Hook Form
3. **Responsive design**: Asegurar que funcione bien en móviles
4. **Estado de la aplicación**: Manejar loading, errores y éxito en formularios

## 📈 Próximos Pasos (si fuera producción)

- [ ] **Testing completo** con Jest y Cypress
- [ ] **Storybook** para documentar componentes
- [ ] **PWA** con service workers
- [ ] **Internacionalización** con next-i18next
- [ ] **Analytics** con Google Analytics
- [ ] **Error tracking** con Sentry
- [ ] **Performance monitoring** con Core Web Vitals
- [ ] **SEO optimization** con meta tags dinámicos

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

Soy un desarrollador frontend que le gusta crear interfaces intuitivas y funcionales. Este proyecto demuestra mis habilidades en:

- React y Next.js modernos
- TypeScript y tipado estático
- CSS y diseño responsive
- Arquitectura de componentes
- Integración con APIs
- UX/UI design

---

> **Nota**: Este proyecto fue desarrollado en 48 horas para una evaluación técnica. Aunque es funcional, en un entorno de producción implementaría más testing, optimizaciones y features.

## 📞 Contacto

- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **LinkedIn**: [Tu Nombre](https://linkedin.com/in/tu-usuario)
- **Email**: tu-email@ejemplo.com
