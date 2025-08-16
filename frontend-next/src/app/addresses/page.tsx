'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { addressService } from '@/services/addressService';
import { clientService } from '@/services/clientService';
import { Address, Client } from '@/types';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterClient, setFilterClient] = useState('');

  useEffect(() => {
    loadAddresses();
    loadClients();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAll();
      if (response.success && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clientService.getAll();
      if (response.success && response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección? Esta acción no se puede deshacer.')) {
      try {
        const response = await addressService.delete(id);
        if (response.success) {
          setAddresses(prev => prev.filter(addr => addr.id !== id));
        } else {
          alert(response.message || 'Error al eliminar la dirección');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Error al eliminar la dirección');
      }
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  const filteredAddresses = addresses.filter(address => {
    const matchesSearch = searchTerm === '' || 
      address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = filterCity === '' || address.city.toLowerCase().includes(filterCity.toLowerCase());
    const matchesClient = filterClient === '' || address.client_id === filterClient;

    return matchesSearch && matchesCity && matchesClient;
  });

  const uniqueCities = [...new Set(addresses.map(addr => addr.city))];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Direcciones</h1>
            <p className="text-gray-600 mt-2">
              Gestiona todas las direcciones registradas en el sistema
            </p>
          </div>
          <Link
            href="/clients/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Dirección
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="search"
                  placeholder="Buscar por calle, ciudad o estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <select
                id="cityFilter"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las ciudades</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Client Filter */}
            <div>
              <label htmlFor="clientFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                id="clientFilter"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los clientes</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Addresses List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Direcciones ({filteredAddresses.length})
            </h2>
          </div>

          {filteredAddresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay direcciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterCity || filterClient 
                  ? 'No se encontraron direcciones con los filtros aplicados.'
                  : 'Comienza agregando la primera dirección.'
                }
              </p>
              {!searchTerm && !filterCity && !filterClient && (
                <div className="mt-6">
                  <Link
                    href="/clients/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Dirección
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAddresses.map((address) => (
                    <tr key={address.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {address.street}
                          </div>
                          <div className="text-sm text-gray-500">
                            {address.state}, {address.postal_code}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{address.city}</div>
                        <div className="text-sm text-gray-500">{address.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/clients/${address.client_id}`}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          {getClientName(address.client_id)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {address.is_primary ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Principal
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Secundaria
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/clients/${address.client_id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver cliente"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/clients/${address.client_id}/addresses/${address.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar dirección"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar dirección"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Información sobre Direcciones</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Cada cliente puede tener múltiples direcciones</li>
            <li>• Solo una dirección por cliente puede ser marcada como principal</li>
            <li>• Las direcciones se pueden editar o eliminar desde aquí</li>
            <li>• Usa los filtros para encontrar direcciones específicas</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
