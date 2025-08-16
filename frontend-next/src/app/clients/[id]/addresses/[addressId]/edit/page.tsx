'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { addressService } from '@/services/addressService';
import { clientService } from '@/services/clientService';
import { UpdateAddressRequest, Address, Client } from '@/types';

export default function EditAddressPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const addressId = params.addressId as string;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<UpdateAddressRequest>({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Dominican Republic',
    is_primary: false
  });

  useEffect(() => {
    if (clientId && addressId) {
      loadAddress();
      loadClient();
    }
  }, [clientId, addressId]);

  const loadAddress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await addressService.getById(addressId);
      if (response.success && response.data) {
        setAddress(response.data);
        setFormData({
          street: response.data.street,
          city: response.data.city,
          state: response.data.state,
          postal_code: response.data.postal_code,
          country: response.data.country,
          is_primary: response.data.is_primary
        });
      } else {
        alert('Error al cargar la dirección');
        router.push(`/clients/${clientId}`);
      }
    } catch (error) {
      console.error('Error loading address:', error);
      alert('Error al cargar la dirección');
      router.push(`/clients/${clientId}`);
    } finally {
      setLoading(false);
    }
  }, [addressId, clientId, router]);

  const loadClient = useCallback(async () => {
    try {
      const response = await clientService.getById(clientId);
      if (response.success && response.data) {
        setClient(response.data);
      }
    } catch (error) {
      console.error('Error loading client:', error);
    }
  }, [clientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.street?.trim() || !formData.city?.trim() || !formData.state?.trim() || !formData.postal_code?.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      setSaving(true);
      const response = await addressService.update(addressId, formData);
      
      if (response.success) {
        router.push(`/clients/${clientId}`);
      } else {
        alert(response.message || 'Error al actualizar la dirección');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error al actualizar la dirección');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!address || !client) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Dirección no encontrada</h3>
          <Link href={`/clients/${clientId}`} className="text-blue-600 hover:text-blue-900">
            Volver al cliente
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href={`/clients/${clientId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Cliente
          </Link>
        </div>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Dirección</h1>
          <p className="text-gray-600">
            Edita la información de la dirección para {client.name}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street */}
            <div className="md:col-span-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Av. Principal #123"
              />
            </div>

            {/* City */}
            <div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Santo Domingo"
              />
            </div>

            {/* State */}
            <div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Distrito Nacional"
              />
            </div>

            {/* Postal Code */}
            <div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10101"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dominican Republic"
              />
            </div>

            {/* Primary Address */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_primary"
                  name="is_primary"
                  checked={formData.is_primary}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-900">
                  Marcar como dirección principal
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Solo una dirección por cliente puede ser marcada como principal
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <Link
              href={`/clients/${clientId}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Información Importante</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Los campos marcados con * son obligatorios</li>
            <li>• Si marcas esta dirección como principal, se desmarcará la anterior</li>
            <li>• La información se puede editar posteriormente</li>
            <li>• Los cambios se aplican inmediatamente</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
