import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Clock, DollarSign } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { Database } from '../lib/database.types';

type Service = Database['public']['Tables']['services']['Row'];

const ServicesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { services, loading, addService, updateService, deleteService } = useServices();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: '',
    is_active: true,
  });

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_minutes: 60,
      price: '',
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: formData.price ? Number(formData.price) : null,
      };

      if (editingService) {
        await updateService(editingService.id, data);
        setEditingService(null);
      } else {
        await addService(data);
        setShowAddService(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration_minutes: service.duration_minutes || 60,
      price: service.price ? service.price.toString() : '',
      is_active: service.is_active ?? true,
    });
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(serviceId);
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const ServiceForm = ({ isEditing = false, onClose }: { isEditing?: boolean; onClose: () => void }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-teal-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-teal-900'>
              {isEditing ? 'Edit Service' : 'New Service'}
            </h2>
            <button onClick={onClose} className='text-teal-400 hover:text-teal-600 transition-colors'>
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Service Name *</label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              placeholder='e.g., Yoga Session, Massage Therapy'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none'
              placeholder='Describe your service...'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Duration (minutes)</label>
              <input
                type='number'
                min='1'
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Price ($)</label>
              <input
                type='number'
                step='0.01'
                min='0'
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                placeholder='0.00'
              />
            </div>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='is_active'
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className='mr-2'
            />
            <label htmlFor='is_active' className='text-sm font-medium text-teal-700'>
              Active Service
            </label>
          </div>

          <div className='flex justify-end space-x-3 pt-4 border-t border-teal-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
            >
              {isEditing ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-teal-900'>Services Management</h1>
          <p className='text-teal-600 mt-1'>Manage your wellness services and offerings</p>
        </div>
        <button
          onClick={() => setShowAddService(true)}
          className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center'
        >
          <Plus size={20} className='mr-2' />
          Add Service
        </button>
      </div>

      {/* Search */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-teal-100'>
        <div className='relative'>
          <Search size={20} className='absolute left-3 top-3 text-teal-400' />
          <input
            type='text'
            placeholder='Search services...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredServices.map((service) => (
          <div key={service.id} className='bg-white rounded-xl p-6 shadow-sm border border-teal-100 hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h3 className='font-semibold text-teal-900 text-lg'>{service.name}</h3>
                <p className='text-teal-600 text-sm mt-1'>{service.description}</p>
              </div>
              <div className='flex items-center space-x-2 ml-4'>
                <button
                  onClick={() => handleEdit(service)}
                  className='text-blue-600 hover:text-blue-700 transition-colors'
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className='text-red-600 hover:text-red-700 transition-colors'
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center text-teal-600'>
                  <Clock size={16} className='mr-2' />
                  <span className='text-sm'>{service.duration_minutes} min</span>
                </div>
                {service.price && (
                  <div className='flex items-center text-teal-600'>
                    <DollarSign size={16} className='mr-1' />
                    <span className='font-medium'>{service.price}</span>
                  </div>
                )}
              </div>

              <div className='flex items-center justify-between pt-3 border-t border-teal-100'>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    service.is_active
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className='text-xs text-teal-500'>
                  Created {new Date(service.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <ServiceForm
          onClose={() => {
            setShowAddService(false);
            resetForm();
          }}
        />
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <ServiceForm
          isEditing={true}
          onClose={() => {
            setEditingService(null);
            resetForm();
          }}
        />
      )}
    </div>
  );
};

export default ServicesManagement;