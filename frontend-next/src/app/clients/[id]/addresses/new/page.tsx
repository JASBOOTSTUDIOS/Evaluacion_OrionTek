'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin, Loader2 } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { addressService } from '@/services/addressService';
import { CreateAddressRequest, Client } from '@/types';

export default function NewAddressPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    client_id: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'República Dominicana',
    is_primary: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && clientId) {
      setFormData(prev => ({ ...prev, client_id: clientId }));
      loadClient();
    }
  }, [mounted, clientId]);

  const loadClient = useCallback(async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      const response = await clientService.getById(clientId);
      
      if (response.success && response.data) {
        setClient(response.data);
      } else {
        alert('Cliente no encontrado');
        router.push('/clients');
      }
    } catch (error) {
      console.error('Error loading client:', error);
      alert('Error al cargar el cliente');
      router.push('/clients');
    } finally {
      setLoading(false);
    }
  }, [clientId, router]);

  const navigateToClient = useCallback(() => {
    if (navigating) return;
    setNavigating(true);
    router.replace(`/clients/${clientId}`);
  }, [navigating, router, clientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) {
      alert('ID de cliente no válido');
      return;
    }
    
    if (!formData.street?.trim() || !formData.city?.trim() || !formData.state?.trim() || !formData.postal_code?.trim()) {
      alert('Los campos calle, ciudad, estado y código postal son obligatorios');
      return;
    }

    try {
      setSaving(true);
      const response = await addressService.create(formData);
      
      if (response.success) {
        // Use replace instead of push to avoid DOM conflicts
        // Add a small delay to ensure the form submission completes
        setTimeout(() => {
          navigateToClient();
        }, 100);
      } else {
        alert(response.message || 'Error al crear la dirección');
      }
    } catch (error) {
      console.error('Error creating address:', error);
      alert('Error al crear la dirección');
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64 sm:min-h-96 px-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="text-center py-8 sm:py-12 px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Cliente no encontrado</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">El cliente que buscas no existe o ha sido eliminado.</p>
          <Link
            href="/clients"
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Volver a Clientes
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <button
            onClick={navigateToClient}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Volver al Cliente
          </button>
        </div>

        <div className="text-center px-4 sm:px-0">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Nueva Dirección</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            Agrega una nueva dirección para {client.name}
          </p>
        </div>

        {/* Client Info */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Cliente</h3>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm sm:text-base">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <div className="font-medium text-gray-900 text-sm sm:text-base">{client.name}</div>
              <div className="text-xs sm:text-sm text-gray-500">{client.email}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Street */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Calle y Número *
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Calle Principal #123"
              />
            </div>

            {/* City */}
            <div className="sm:col-span-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Santo Domingo"
              />
            </div>

            {/* State */}
            <div className="sm:col-span-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                Estado/Provincia *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Distrito Nacional"
              />
            </div>

            {/* Postal Code */}
            <div className="sm:col-span-1">
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal *
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10101"
              />
            </div>

            {/* Country */}
            <div className="sm:col-span-1">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="República Dominicana"
              />
            </div>
          </div>

          {/* Primary Address */}
          <div className="flex items-center pt-4">
            <input
              id="is_primary"
              name="is_primary"
              type="checkbox"
              checked={formData.is_primary}
              onChange={handleInputChange}
              className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
            />
            <label htmlFor="is_primary" className="ml-2 sm:ml-3 block text-sm sm:text-base text-gray-900">
              Marcar como dirección principal
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={navigateToClient}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:py-3 text-sm sm:text-base border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Guardar Dirección
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-medium text-blue-800 mb-2 sm:mb-3">Información Importante</h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1 sm:space-y-2">
            <li>• Los campos marcados con * son obligatorios</li>
            <li>• Solo una dirección puede ser marcada como principal</li>
            <li>• La dirección se asociará automáticamente al cliente</li>
            <li>• Puedes editar o eliminar la dirección después</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
