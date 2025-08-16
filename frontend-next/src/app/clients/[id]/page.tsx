'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, MapPin, Plus, Mail, Phone, Building, Calendar, MapPinIcon } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { addressService } from '@/services/addressService';
import { ClientWithAddresses, Address } from '@/types';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<ClientWithAddresses | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = useCallback(async () => {
    try {
      setLoading(true);
      const [clientResponse, addressesResponse] = await Promise.all([
        clientService.getById(clientId),
        addressService.getByClientId(clientId)
      ]);

      if (clientResponse.success && clientResponse.data) {
        setClient({ ...clientResponse.data, addresses: [] });
      }

      if (addressesResponse.success && addressesResponse.data) {
        setAddresses(addressesResponse.data);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        const response = await clientService.delete(clientId);
        if (response.success) {
          router.push('/clients');
        }
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleAddressDelete = async (addressId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      try {
        const response = await addressService.delete(addressId);
        if (response.success) {
          setAddresses(addresses.filter(addr => addr.id !== addressId));
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cliente no encontrado</h2>
          <p className="text-gray-600 mb-6">El cliente que buscas no existe o ha sido eliminado.</p>
          <Link
            href="/clients"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Clientes
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Link
              href="/clients"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Clientes
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/clients/${clientId}/edit`}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" />
              Editar Cliente
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Eliminar
            </button>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                {client.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {client.phone}
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    {client.company}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Creado: {formatDate(client.created_at)}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Actualizado: {formatDate(client.updated_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Direcciones</h2>
            <Link
              href={`/clients/${clientId}/addresses/new`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Dirección
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay direcciones registradas</h3>
              <p className="text-gray-500 mb-4">Agrega la primera dirección para este cliente</p>
              <Link
                href={`/clients/${clientId}/addresses/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Dirección
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {address.is_primary && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/addresses/${address.id}/edit`}
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleAddressDelete(address.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href={`/clients/${clientId}/edit`}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <Edit className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Editar Cliente</div>
                <div className="text-sm text-gray-500">Modificar información</div>
              </div>
            </Link>
            
            <Link
              href={`/clients/${clientId}/addresses/new`}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <MapPin className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Nueva Dirección</div>
                <div className="text-sm text-gray-500">Agregar ubicación</div>
              </div>
            </Link>
            
            <Link
              href="/clients"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Ver Todos</div>
                <div className="text-sm text-gray-500">Lista de clientes</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
