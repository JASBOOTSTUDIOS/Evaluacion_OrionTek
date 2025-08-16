'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, Users, MapPin, X } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { addressService } from '@/services/addressService';
import { Client, Address } from '@/types';
import Link from 'next/link';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'clients' | 'addresses'>('clients');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ clients: Client[]; addresses: Address[] }>({
    clients: [],
    addresses: []
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      
      if (searchType === 'clients') {
        const response = await clientService.searchByName(searchTerm);
        if (response.success && response.data) {
          setResults(prev => ({ ...prev, clients: response.data as Client[] }));
        } else {
          setResults(prev => ({ ...prev, clients: [] }));
        }
      } else {
        const response = await addressService.searchByCity(searchTerm);
        if (response.success && response.data) {
          setResults(prev => ({ ...prev, addresses: response.data as Address[] }));
        } else {
          setResults(prev => ({ ...prev, addresses: [] }));
        }
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults({ clients: [], addresses: [] });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda Avanzada</h1>
          <p className="text-gray-600">
            Encuentra clientes y direcciones rápidamente con filtros inteligentes
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="space-y-4">
            {/* Search Type Toggle */}
            <div className="flex justify-center">
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSearchType('clients')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'clients'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Clientes
                </button>
                <button
                  onClick={() => setSearchType('addresses')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'addresses'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Direcciones
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  searchType === 'clients'
                    ? 'Buscar clientes por nombre, email o empresa...'
                    : 'Buscar direcciones por ciudad...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || loading}
                  className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>
            </div>

            {/* Search Tips */}
            <div className="text-sm text-gray-500 text-center">
              {searchType === 'clients' ? (
                <p>💡 Busca por nombre, email o empresa del cliente</p>
              ) : (
                <p>💡 Busca por ciudad, estado o código postal</p>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {searchTerm && (
          <div className="space-y-6">
            {/* Clients Results */}
            {searchType === 'clients' && results.clients.length > 0 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Clientes Encontrados ({results.clients.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.clients.map((client) => (
                    <div
                      key={client.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{client.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{client.email}</p>
                      {client.company && (
                        <p className="text-sm text-gray-500 mb-2">{client.company}</p>
                      )}
                      {client.phone && (
                        <p className="text-sm text-gray-600 mb-3">📞 {client.phone}</p>
                      )}
                      <div className="text-xs text-gray-400 mb-3">
                        Creado: {formatDate(client.created_at)}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/clients/${client.id}`}
                          className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/clients/${client.id}/edit`}
                          className="flex-1 text-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Results */}
            {searchType === 'addresses' && results.addresses.length > 0 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Direcciones Encontradas ({results.addresses.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          {address.is_primary && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Principal
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-gray-900">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                        {address.country && (
                          <p className="text-gray-500">{address.country}</p>
                        )}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                        Creado: {formatDate(address.created_at)}
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <Link
                          href={`/clients/${address.client_id}`}
                          className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Ver Cliente
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {((searchType === 'clients' && results.clients.length === 0) ||
              (searchType === 'addresses' && results.addresses.length === 0)) && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
                <div className="text-gray-400 mb-4">
                  {searchType === 'clients' ? (
                    <Users className="w-16 h-16 mx-auto" />
                  ) : (
                    <MapPin className="w-16 h-16 mx-auto" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron {searchType === 'clients' ? 'clientes' : 'direcciones'}
                </h3>
                <p className="text-gray-500 mb-4">
                  Intenta con otros términos de búsqueda o verifica la ortografía
                </p>
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar Búsqueda
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!searchTerm && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/clients"
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Ver Todos los Clientes</div>
                  <div className="text-sm text-gray-500">Lista completa</div>
                </div>
              </Link>
              
              <Link
                href="/clients/new"
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <Users className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Nuevo Cliente</div>
                  <div className="text-sm text-gray-500">Agregar cliente</div>
                </div>
              </Link>
              
              <Link
                href="/"
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <Search className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Dashboard</div>
                  <div className="text-sm text-gray-500">Vista general</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
