import Layout from '@/components/Layout';
import Link from 'next/link';
import { Users, MapPin, Search, Plus, Database } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Gestión de Clientes',
      description: 'Crea, edita y administra información de clientes de manera eficiente',
      icon: Users,
      href: '/clients',
      color: 'bg-blue-500',
    },
    {
      title: 'Gestión de Direcciones',
      description: 'Maneja múltiples direcciones por cliente con soporte para dirección principal',
      icon: MapPin,
      href: '/addresses',
      color: 'bg-green-500',
    },
    {
      title: 'Búsqueda Avanzada',
      description: 'Encuentra clientes y direcciones rápidamente con filtros inteligentes',
      icon: Search,
      href: '/search',
      color: 'bg-purple-500',
    },
    {
      title: 'Base de Datos',
      description: 'Almacenamiento seguro con PostgreSQL y arquitectura CQRS',
      icon: Database,
      href: '/clients',
      color: 'bg-orange-500',
    },
  ];

  const quickActions = [
    {
      title: 'Nuevo Cliente',
      description: 'Agregar un nuevo cliente al sistema',
      icon: Plus,
      href: '/clients/new',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Ver Clientes',
      description: 'Lista completa de clientes registrados',
      icon: Users,
      href: '/clients',
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a OrionTek
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema completo de gestión de clientes con arquitectura moderna, 
            interfaz intuitiva y funcionalidades avanzadas para tu negocio.
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`${action.color} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                >
                  <div className="flex items-center space-x-4">
                    <Icon className="w-8 h-8" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{action.title}</h3>
                      <p className="text-blue-100">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
                >
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Estadísticas del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Clientes Registrados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Direcciones</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600">Disponibilidad</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
