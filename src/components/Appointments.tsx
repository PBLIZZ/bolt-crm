import React, { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Edit, Trash2, X } from 'lucide-react';
import { DateTimePicker } from './ui/datetime-picker';
import { useAppointments } from '../hooks/useAppointments';
import { Database } from '../lib/database.types';
import { useClients } from '../hooks/useClients';
import { useServices } from '../hooks/useServices';

const Appointments = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  type Appointment = Database['public']['Tables']['appointments']['Row'] & {
    clients?: { first_name: string; last_name: string };
    services?: { name: string };
  };

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const { appointments, loading, addAppointment, updateAppointment, deleteAppointment } =
    useAppointments();
  const { clients } = useClients();
  const { services } = useServices();

  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    status: 'scheduled',
    location: '',
    notes: '',
  });

  const timeSlots = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const resetForm = () => {
    setFormData({
      client_id: '',
      service_id: '',
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      status: 'scheduled',
      location: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, formData);
        setEditingAppointment(null);
      } else {
        await addAppointment(formData);
        setShowAddAppointment(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      client_id: appointment.client_id,
      service_id: appointment.service_id || '',
      title: appointment.title,
      description: appointment.description || '',
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status,
      location: appointment.location ?? '',
      notes: appointment.notes ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter((apt) => apt.start_time.startsWith(dateStr));
  };

  const getWeekDates = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <div
      className={`p-3 rounded-lg border-l-4 mb-2 ${
        appointment.status === 'confirmed'
          ? 'bg-teal-50 border-teal-500'
          : appointment.status === 'completed'
            ? 'bg-blue-50 border-blue-500'
            : 'bg-amber-50 border-amber-500'
      }`}
    >
      <div className='flex items-center justify-between mb-2'>
        <h4 className='font-medium text-sky-900 text-sm'>
          {appointment.clients
            ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
            : 'Unknown Client'}
        </h4>
        <div className='flex items-center space-x-1'>
          <button
            onClick={() => handleEdit(appointment)}
            className='text-blue-600 hover:text-blue-700 transition-colors'
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => handleDelete(appointment.id)}
            className='text-red-600 hover:text-red-700 transition-colors'
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className='text-sm text-sky-600 mb-1'>{appointment.title}</p>
      <p className='text-sm text-sky-500'>
        {new Date(appointment.start_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      {appointment.notes && <p className='text-xs text-sky-500 mt-2 italic'>{appointment.notes}</p>}
    </div>
  );

  const AppointmentForm = ({
    isEditing = false,
    onClose,
  }: {
    isEditing: boolean;
    onClose: () => void;
  }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-sky-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-sky-900'>
              {isEditing ? 'Edit Appointment' : 'New Appointment'}
            </h2>
            <button onClick={onClose} className='text-sky-400 hover:text-sky-600 transition-colors'>
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-sky-700 mb-2'>Client *</label>
              <select
                required
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className='w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value=''>Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-sky-700 mb-2'>Service</label>
              <select
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                className='w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value=''>Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-sky-700 mb-2'>Title *</label>
            <input
              type='text'
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className='w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              placeholder='Appointment title'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-sky-700 mb-2'>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              placeholder='Appointment description'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-sky-700 mb-2'>Start Time *</label>
              <DateTimePicker
                date={formData.start_time ? new Date(formData.start_time) : undefined}
                onDateChange={(date) => setFormData({ ...formData, start_time: date ? date.toISOString() : '' })}
                placeholder="Select start time"
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-sky-700 mb-2'>End Time *</label>
              <DateTimePicker
                date={formData.end_time ? new Date(formData.end_time) : undefined}
                onDateChange={(date) => setFormData({ ...formData, end_time: date ? date.toISOString() : '' })}
                placeholder="Select end time"
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-sky-700 mb-2'>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className='w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='scheduled'>Scheduled</option>
                <option value='confirmed'>Confirmed</option>
                <option value='completed'>Completed</option>
                <option value='cancelled'>Cancelled</option>
                <option value='no_show'>No Show</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-sky-700 mb-2'>Location</label>
              <input
                type='text'
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className='w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                placeholder='Appointment location'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-sky-700 mb-2'>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              placeholder='Additional notes'
            />
          </div>

          <div className='flex justify-end space-x-3 pt-4 border-t border-sky-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
            >
              {isEditing ? 'Update Appointment' : 'Create Appointment'}
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
          <h1 className='text-3xl font-bold text-sky-900'>Appointments</h1>
          <p className='text-sky-600 mt-1'>Manage your wellness appointments and schedule</p>
        </div>
        <button
          onClick={() => setShowAddAppointment(true)}
          className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center'
        >
          <Plus size={20} className='mr-2' />
          New Appointment
        </button>
      </div>

      {/* Calendar Controls */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-sky-100'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() =>
                setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))
              }
              className='p-2 hover:bg-sky-100 rounded-lg transition-colors'
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className='text-xl font-semibold text-sky-900'>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() =>
                setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))
              }
              className='p-2 hover:bg-sky-100 rounded-lg transition-colors'
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                view === 'day' ? 'bg-teal-100 text-teal-700' : 'text-sky-600 hover:bg-sky-100'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                view === 'week' ? 'bg-teal-100 text-teal-700' : 'text-sky-600 hover:bg-sky-100'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Week View */}
        {view === 'week' && (
          <div className='grid grid-cols-8 gap-2'>
            <div className='p-2'></div>
            {getWeekDates().map((date, index) => (
              <div key={index} className='p-2 text-center'>
                <div className='text-sm font-medium text-sky-900'>{weekDays[index]}</div>
                <div className='text-lg font-semibold text-sky-700'>{date.getDate()}</div>
              </div>
            ))}

            {timeSlots.map((time, timeIndex) => (
              <React.Fragment key={timeIndex}>
                <div className='p-2 text-sm text-sky-500 border-r border-sky-100'>{time}</div>
                {getWeekDates().map((date, dateIndex) => {
                  const dayAppointments = getAppointmentsForDate(date);
                  const timeHour = time.includes('AM')
                    ? time === '12:00 PM'
                      ? 12
                      : parseInt(time)
                    : time === '12:00 PM'
                      ? 12
                      : parseInt(time) + 12;

                  const timeAppointments = dayAppointments.filter((apt) => {
                    const aptHour = new Date(apt.start_time).getHours();
                    return aptHour === timeHour;
                  });

                  return (
                    <div key={dateIndex} className='p-1 min-h-16 border-r border-sky-100'>
                      {timeAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Day View */}
        {view === 'day' && (
          <div className='space-y-4'>
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-sky-900'>
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
            </div>

            <div className='grid grid-cols-1 gap-2'>
              {timeSlots.map((time) => {
                const todayAppointments = getAppointmentsForDate(currentDate);
                const timeHour = time.includes('AM')
                  ? time === '12:00 PM'
                    ? 12
                    : parseInt(time)
                  : time === '12:00 PM'
                    ? 12
                    : parseInt(time) + 12;

                const timeAppointments = todayAppointments.filter((apt) => {
                  const aptHour = new Date(apt.start_time).getHours();
                  return aptHour === timeHour;
                });

                return (
                  <div key={time} className='flex items-center border-b border-sky-100 pb-2'>
                    <div className='w-20 text-sm text-sky-500 mr-4'>{time}</div>
                    <div className='flex-1'>
                      {timeAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-sky-100'>
        <h2 className='text-xl font-semibold text-sky-900 mb-4'>Upcoming Appointments</h2>
        <div className='space-y-3'>
          {appointments.slice(0, 5).map((appointment) => (
            <div
              key={appointment.id}
              className='flex items-center justify-between p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors'
            >
              <div className='flex items-center space-x-4'>
                <div className='p-2 bg-teal-100 rounded-lg'>
                  <Calendar size={20} className='text-teal-600' />
                </div>
                <div>
                  <h4 className='font-medium text-sky-900'>
                    {appointment.clients
                      ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
                      : 'Unknown Client'}
                  </h4>
                  <p className='text-sm text-sky-600'>{appointment.title}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-sky-900'>
                  {new Date(appointment.start_time).toLocaleDateString()}
                </p>
                <p className='text-sm text-sky-500'>
                  {new Date(appointment.start_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <AppointmentForm
          isEditing={false}
          onClose={() => {
            setShowAddAppointment(false);
            resetForm();
          }}
        />
      )}

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <AppointmentForm
          isEditing={true}
          onClose={() => {
            setEditingAppointment(null);
            resetForm();
          }}
        />
      )}
    </div>
  );
};

export default Appointments;