import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { usePayments } from '../hooks/usePayments';
import { useClients } from '../hooks/useClients';
import { useServices } from '../hooks/useServices';
import { usePackages } from '../hooks/usePackages';
import { Database } from '../lib/database.types';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);

  type Payment = Database['public']['Tables']['payments']['Row'] & {
    clients?: { first_name: string; last_name: string };
    services?: { name: string };
    packages?: { name: string };
  };

  type Package = Database['public']['Tables']['packages']['Row'];

  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const {
    payments,
    loading: paymentsLoading,
    addPayment,
    updatePayment,
    deletePayment,
  } = usePayments();
  const { clients } = useClients();
  const { services } = useServices();
  const { packages, addPackage, updatePackage, deletePackage } = usePackages();

  const [paymentFormData, setPaymentFormData] = useState({
    client_id: '',
    service_id: '',
    package_id: '',
    amount: '',
    currency: 'USD',
    payment_method: 'card',
    status: 'completed',
    transaction_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [packageFormData, setPackageFormData] = useState({
    name: '',
    description: '',
    price: '',
    session_count: '',
    validity_days: 90,
    is_active: true,
  });

  const filteredPayments = payments.filter(
    (payment) =>
      (payment.clients &&
        `${payment.clients.first_name} ${payment.clients.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (payment.services &&
        payment.services.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.packages && payment.packages.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const completedPayments = payments.filter((p) => p.status === 'completed').length;

  const resetPaymentForm = () => {
    setPaymentFormData({
      client_id: '',
      service_id: '',
      package_id: '',
      amount: '',
      currency: 'USD',
      payment_method: 'card',
      status: 'completed',
      transaction_id: '',
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const resetPackageForm = () => {
    setPackageFormData({
      name: '',
      description: '',
      price: '',
      session_count: '',
      validity_days: 90,
      is_active: true,
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...paymentFormData,
        amount: Number(paymentFormData.amount),
        service_id: paymentFormData.service_id || null,
        package_id: paymentFormData.package_id || null,
      };

      if (editingPayment) {
        await updatePayment(editingPayment.id as string, data);
        setEditingPayment(null);
      } else {
        await addPayment(data);
        setShowAddPayment(false);
      }
      resetPaymentForm();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...packageFormData,
        price: Number(packageFormData.price),
        session_count: Number(packageFormData.session_count),
      };

      if (editingPackage) {
        await updatePackage(editingPackage.id as string, data);
        setEditingPackage(null);
      } else {
        await addPackage(data);
        setShowAddPackage(false);
      }
      resetPackageForm();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setPaymentFormData({
      client_id: payment.client_id,
      service_id: payment.service_id || '',
      package_id: payment.package_id || '',
      amount: payment.amount.toString(),
      currency: payment.currency || 'USD',
      payment_method: payment.payment_method || 'card',
      status: payment.status,
      transaction_id: payment.transaction_id || '',
      payment_date: payment.payment_date.split('T')[0],
      notes: payment.notes || '',
    });
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setPackageFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price.toString(),
      session_count: pkg.session_count.toString(),
      validity_days: pkg.validity_days || 90,
      is_active: pkg.is_active ?? true,
    });
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(paymentId);
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(packageId);
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const PaymentForm = ({
    isEditing = false,
    onClose,
  }: {
    isEditing: boolean;
    onClose: () => void;
  }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-fuchsia-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {isEditing ? 'Edit Payment' : 'New Payment'}
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handlePaymentSubmit} className='p-6 space-y-6'>
          <div>
            <label className='block text-sm font-medium text-fuchsia-700 mb-2'>Client *</label>
            <select
              required
              value={paymentFormData.client_id}
              onChange={(e) =>
                setPaymentFormData({ ...paymentFormData, client_id: e.target.value })
              }
              className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            >
              <option value=''>Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Service</label>
              <select
                value={paymentFormData.service_id}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    service_id: e.target.value,
                    package_id: '',
                  })
                }
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value=''>Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Package</label>
              <select
                value={paymentFormData.package_id}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    package_id: e.target.value,
                    service_id: '',
                  })
                }
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value=''>Select a package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-fuchsia-700 mb-2'>Amount *</label>
              <input
                type='number'
                step='0.01'
                required
                value={paymentFormData.amount}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Payment Method</label>
              <select
                value={paymentFormData.payment_method}
                onChange={(e) =>
                  setPaymentFormData({ ...paymentFormData, payment_method: e.target.value })
                }
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='cash'>Cash</option>
                <option value='card'>Card</option>
                <option value='bank_transfer'>Bank Transfer</option>
                <option value='online'>Online</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
              <select
                value={paymentFormData.status}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, status: e.target.value })}
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='pending'>Pending</option>
                <option value='completed'>Completed</option>
                <option value='failed'>Failed</option>
                <option value='refunded'>Refunded</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Payment Date</label>
              <input
                type='date'
                value={paymentFormData.payment_date}
                onChange={(e) =>
                  setPaymentFormData({ ...paymentFormData, payment_date: e.target.value })
                }
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Transaction ID</label>
            <input
              type='text'
              value={paymentFormData.transaction_id}
              onChange={(e) =>
                setPaymentFormData({ ...paymentFormData, transaction_id: e.target.value })
              }
              className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Notes</label>
            <textarea
              value={paymentFormData.notes}
              onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>

          <div className='flex justify-end space-x-3 pt-4 border-t border-fuchsia-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 border border-fuchsia-200 rounded-lg hover:bg-fuchsia-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
            >
              {isEditing ? 'Update Payment' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const PackageForm = ({
    isEditing = false,
    onClose,
  }: {
    isEditing: boolean;
    onClose: () => void;
  }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-fuchsia-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {isEditing ? 'Edit Package' : 'New Package'}
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handlePackageSubmit} className='p-6 space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Package Name *</label>
            <input
              type='text'
              required
              value={packageFormData.name}
              onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
              className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
            <textarea
              value={packageFormData.description}
              onChange={(e) =>
                setPackageFormData({ ...packageFormData, description: e.target.value })
              }
              rows={3}
              className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Price *</label>
              <input
                type='number'
                step='0.01'
                required
                value={packageFormData.price}
                onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Session Count *
              </label>
              <input
                type='number'
                required
                value={packageFormData.session_count}
                onChange={(e) =>
                  setPackageFormData({ ...packageFormData, session_count: e.target.value })
                }
                className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Validity (days)</label>
            <input
              type='number'
              value={packageFormData.validity_days}
              onChange={(e) =>
                setPackageFormData({ ...packageFormData, validity_days: parseInt(e.target.value) })
              }
              className='w-full px-3 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='is_active'
              checked={packageFormData.is_active}
              onChange={(e) =>
                setPackageFormData({ ...packageFormData, is_active: e.target.checked })
              }
              className='mr-2'
            />
            <label htmlFor='is_active' className='text-sm font-medium text-gray-700'>
              Active Package
            </label>
          </div>

          <div className='flex justify-end space-x-3 pt-4 border-t border-fuchsia-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 border border-fuchsia-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
            >
              {isEditing ? 'Update Package' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (paymentsLoading) {
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
          <h1 className='text-3xl font-bold text-gray-900'>Payments & Packages</h1>
          <p className='text-gray-600 mt-1'>Manage payments and service packages</p>
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={() => setShowAddPackage(true)}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center'
          >
            <Plus size={20} className='mr-2' />
            New Package
          </button>
          <button
            onClick={() => setShowAddPayment(true)}
            className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center'
          >
            <Plus size={20} className='mr-2' />
            New Payment
          </button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-xl p-6 shadow-sm border border-fuchsia-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Revenue</p>
              <p className='text-2xl font-bold text-gray-900'>${totalRevenue.toLocaleString()}</p>
            </div>
            <div className='p-3 bg-teal-100 rounded-lg'>
              <DollarSign size={24} className='text-teal-600' />
            </div>
          </div>
          <div className='flex items-center mt-4'>
            <TrendingUp size={16} className='text-teal-500 mr-1' />
            <span className='text-sm text-teal-600'>+12% vs last month</span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm border border-fuchsia-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Completed Payments</p>
              <p className='text-2xl font-bold text-gray-900'>{completedPayments}</p>
            </div>
            <div className='p-3 bg-blue-100 rounded-lg'>
              <CheckCircle size={24} className='text-blue-600' />
            </div>
          </div>
          <div className='flex items-center mt-4'>
            <span className='text-sm text-gray-600'>This month</span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm border border-fuchsia-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Pending Payments</p>
              <p className='text-2xl font-bold text-gray-900'>{pendingPayments}</p>
            </div>
            <div className='p-3 bg-amber-100 rounded-lg'>
              <Clock size={24} className='text-amber-600' />
            </div>
          </div>
          <div className='flex items-center mt-4'>
            <span className='text-sm text-gray-600'>Requires attention</span>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className='bg-white rounded-xl shadow-sm border border-fuchsia-100'>
        <div className='p-6 border-b border-fuchsia-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>Recent Payments</h2>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <Search size={20} className='absolute left-3 top-3 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search payments...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 pr-4 py-2 border border-fuchsia-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                />
              </div>
              <button className='flex items-center px-4 py-2 border border-fuchsia-200 rounded-lg hover:bg-gray-50 transition-colors'>
                <Filter size={20} className='mr-2' />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left py-3 px-6 font-medium text-gray-900'>Client</th>
                <th className='text-left py-3 px-6 font-medium text-gray-900'>Service/Package</th>
                <th className='text-left py-3 px-6 font-medium text-gray-900'>Amount</th>
                <th className='text-left py-3 px-6 font-medium text-gray-900'>Date</th>
                <th className='text-left py-3 px-6 font-medium text-gray-900'>Status</th>
                <th className='text-left py-3 px-6 font-medium text-gray-900'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className='hover:bg-gray-50 transition-colors'>
                  <td className='py-4 px-6'>
                    <div className='font-medium text-gray-900'>
                      {payment.clients
                        ? `${payment.clients.first_name} ${payment.clients.last_name}`
                        : 'Unknown Client'}
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='text-sm text-gray-900'>
                      {payment.services
                        ? payment.services.name
                        : payment.packages
                          ? payment.packages.name
                          : 'N/A'}
                    </div>
                    <div className='text-sm text-gray-500'>{payment.payment_method}</div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='font-medium text-gray-900'>${payment.amount}</div>
                  </td>
                  <td className='py-4 px-6 text-sm text-gray-900'>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className='py-4 px-6'>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed'
                          ? 'bg-teal-100 text-teal-700'
                          : payment.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => handleEditPayment(payment)}
                        className='text-blue-600 hover:text-blue-700 transition-colors text-sm'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
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

      {/* Service Packages */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-fuchsia-100'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-gray-900'>Service Packages</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className='border border-fuchsia-200 rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <div className='flex items-center justify-between mb-3'>
                <h3 className='font-semibold text-gray-900'>{pkg.name}</h3>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className='text-blue-600 hover:text-blue-700 transition-colors'
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className='text-red-600 hover:text-red-700 transition-colors'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className='text-sm text-gray-600 mb-3'>{pkg.description}</p>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-2xl font-bold text-gray-900'>${pkg.price}</p>
                  <p className='text-sm text-gray-500'>{pkg.session_count} sessions</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pkg.is_active ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showAddPayment && (
        <PaymentForm
          isEditing={false}
          onClose={() => {
            setShowAddPayment(false);
            resetPaymentForm();
          }}
        />
      )}

      {/* Edit Payment Modal */}
      {editingPayment && (
        <PaymentForm
          isEditing={true}
          onClose={() => {
            setEditingPayment(null);
            resetPaymentForm();
          }}
        />
      )}

      {/* Package Form Modal */}
      {showAddPackage && (
        <PackageForm
          isEditing={false}
          onClose={() => {
            setShowAddPackage(false);
            resetPackageForm();
          }}
        />
      )}

      {/* Edit Package Modal */}
      {editingPackage && (
        <PackageForm
          isEditing={true}
          onClose={() => {
            setEditingPackage(null);
            resetPackageForm();
          }}
        />
      )}
    </div>
  );
};

export default Payments;
