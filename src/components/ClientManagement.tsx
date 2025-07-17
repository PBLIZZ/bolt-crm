import React, { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, Calendar, X } from 'lucide-react';
import { DatePicker } from './ui/date-picker';
import { useClients } from '../hooks/useClients';
import { Database } from '../lib/database.types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientFormData = Omit<Database['public']['Tables']['clients']['Insert'], 'user_id' | 'id'> & {
  id?: string;
};

const ClientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();

  const [formData, setFormData] = useState<ClientFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    health_conditions: '',
    medications: '',
    goals: '',
    notes: '',
    status: 'active',
  });

  const filteredClients = clients.filter(
    (client) =>
      `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      health_conditions: '',
      medications: '',
      goals: '',
      notes: '',
      status: 'active',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
        setEditingClient(null);
      } else {
        await addClient(formData);
        setShowAddClient(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone,
      date_of_birth: client.date_of_birth,
      address: client.address,
      emergency_contact_name: client.emergency_contact_name,
      emergency_contact_phone: client.emergency_contact_phone,
      health_conditions: client.health_conditions,
      medications: client.medications,
      goals: client.goals,
      notes: client.notes,
      status: client.status,
    });
  };

  const handleDelete = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600'></div>
      </div>
    );
  }

  const ClientForm = ({
    isEditing = false,
    onClose,
  }: {
    isEditing?: boolean;
    onClose: () => void;
  }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-teal-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-teal-900'>
              {isEditing ? 'Edit Client' : 'Add New Client'}
            </h2>
            <button
              onClick={onClose}
              className='text-teal-400 hover:text-teal-600 transition-colors'
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>First Name *</label>
              <input
                type='text'
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Last Name *</label>
              <input
                type='text'
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Email</label>
              <input
                type='email'
                value={formData.email ?? ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Phone</label>
              <input
                type='tel'
                value={formData.phone ?? ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Date of Birth</label>
              <DatePicker
                date={formData.date_of_birth ? new Date(formData.date_of_birth) : undefined}
                onDateChange={(date) => setFormData({ ...formData, date_of_birth: date ? date.toISOString().split('T')[0] : '' })}
                placeholder="Select date of birth"
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='archived'>Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Address</label>
            <textarea
              value={formData.address ?? ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>
                Emergency Contact Name
              </label>
              <input
                type='text'
                value={formData.emergency_contact_name ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_contact_name: e.target.value })
                }
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>
                Emergency Contact Phone
              </label>
              <input
                type='tel'
                value={formData.emergency_contact_phone ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_contact_phone: e.target.value })
                }
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>
              Health Conditions
            </label>
            <textarea
              value={formData.health_conditions ?? ''}
              onChange={(e) => setFormData({ ...formData, health_conditions: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Medications</label>
            <textarea
              value={formData.medications ?? ''}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Goals</label>
            <textarea
              value={formData.goals ?? ''}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Notes</label>
            <textarea
              value={formData.notes ?? ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none'
            />
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
              {isEditing ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ClientModal = ({ client, onClose }: { client: Client; onClose: () => void }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-teal-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-teal-900'>
              {client.first_name} {client.last_name}
            </h2>
            <button
              onClick={onClose}
              className='text-teal-400 hover:text-teal-600 transition-colors'
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Contact Information</h3>
              <div className='space-y-2'>
                <div className='flex items-center'>
                  <Mail size={16} className='text-teal-400 mr-2' />
                  <span className='text-teal-600'>{client.email || 'No email'}</span>
                </div>
                <div className='flex items-center'>
                  <Phone size={16} className='text-teal-400 mr-2' />
                  <span className='text-teal-600'>{client.phone || 'No phone'}</span>
                </div>
                <div className='flex items-center'>
                  <Calendar size={16} className='text-teal-400 mr-2' />
                  <span className='text-teal-600'>
                    Joined: {new Date(client.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Status</h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-teal-100 text-teal-700'
                }`}
              >
                {client.status}
              </span>
            </div>
          </div>

          {client.address && (
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Address</h3>
              <p className='text-teal-600 bg-teal-50 p-4 rounded-lg'>{client.address}</p>
            </div>
          )}

          {(client.emergency_contact_name || client.emergency_contact_phone) && (
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Emergency Contact</h3>
              <div className='bg-teal-50 p-4 rounded-lg'>
                <p className='text-teal-600'>{client.emergency_contact_name}</p>
                <p className='text-teal-600'>{client.emergency_contact_phone}</p>
              </div>
            </div>
          )}

          {client.health_conditions && (
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Health Conditions</h3>
              <p className='text-teal-600 bg-teal-50 p-4 rounded-lg'>{client.health_conditions}</p>
            </div>
          )}

          {client.medications && (
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Medications</h3>
              <p className='text-teal-600 bg-teal-50 p-4 rounded-lg'>{client.medications}</p>
            </div>
          )}

          {client.goals && (
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Goals</h3>
              <p className='text-teal-600 bg-teal-50 p-4 rounded-lg'>{client.goals}</p>
            </div>
          )}

          {client.notes && (
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Notes</h3>
              <p className='text-teal-600 bg-teal-50 p-4 rounded-lg'>{client.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-teal-900'>Client Management</h1>
          <p className='text-teal-600 mt-1'>Manage your wellness clients and their information</p>
        </div>
        <button
          onClick={() => setShowAddClient(true)}
          className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center'
        >
          <Plus size={20} className='mr-2' />
          Add Client
        </button>
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-teal-100'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1 relative'>
            <Search size={20} className='absolute left-3 top-3 text-teal-400' />
            <input
              type='text'
              placeholder='Search clients...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>
          <button className='flex items-center px-4 py-2 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors'>
            <Filter size={20} className='mr-2' />
            Filter
          </button>
        </div>
      </div>

      {/* Clients List */}
      <div className='bg-white rounded-xl shadow-sm border border-teal-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-teal-50'>
              <tr>
                <th className='text-left py-3 px-6 font-medium text-teal-900'>Name</th>
                <th className='text-left py-3 px-6 font-medium text-teal-900'>Contact</th>
                <th className='text-left py-3 px-6 font-medium text-teal-900'>Status</th>
                <th className='text-left py-3 px-6 font-medium text-teal-900'>Joined</th>
                <th className='text-left py-3 px-6 font-medium text-teal-900'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-teal-200'>
              {filteredClients.map((client) => (
                <tr key={client.id} className='hover:bg-teal-50 transition-colors'>
                  <td className='py-4 px-6'>
                    <div>
                      <div className='font-medium text-teal-900'>
                        {client.first_name} {client.last_name}
                      </div>
                      <div className='text-sm text-teal-500'>
                        {client.goals ? 'Has goals set' : 'No goals set'}
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='text-sm text-teal-900'>{client.email || 'No email'}</div>
                    <div className='text-sm text-teal-500'>{client.phone || 'No phone'}</div>
                  </td>
                  <td className='py-4 px-6'>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-sm text-teal-900'>
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => setSelectedClient(client)}
                        className='text-teal-600 hover:text-teal-700 transition-colors text-sm'
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(client)}
                        className='text-blue-600 hover:text-blue-700 transition-colors text-sm'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className='text-red-600 hover:text-red-700 transition-colors text-sm'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <ClientForm
          onClose={() => {
            setShowAddClient(false);
            resetForm();
          }}
        />
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <ClientForm
          isEditing={true}
          onClose={() => {
            setEditingClient(null);
            resetForm();
          }}
        />
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}
    </div>
  );
};

export default ClientManagement;