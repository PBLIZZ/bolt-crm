import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, User, Edit, Trash2, X } from 'lucide-react';
import { useSessionNotes } from '../hooks/useSessionNotes';
import { useClients } from '../hooks/useClients';
import { useServices } from '../hooks/useServices';
import { Database } from '../lib/database.types';

const SessionNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  type SessionNote = Database['public']['Tables']['session_notes']['Row'] & {
    clients?: { first_name: string; last_name: string };
    services?: { name: string };
  };

  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<SessionNote | null>(null);

  const { sessionNotes, loading, addSessionNote, updateSessionNote, deleteSessionNote } =
    useSessionNotes();
  const { clients } = useClients();
  const { services } = useServices();

  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    session_date: '',
    duration_minutes: 60,
    notes: '',
    goals: '',
    progress_notes: '',
    next_steps: '',
    mood_rating: 5,
    energy_level: 5,
    pain_level: 0,
  });

  const filteredNotes = sessionNotes.filter(
    (note) =>
      (note.clients &&
        `${note.clients.first_name} ${note.clients.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (note.services && note.services.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      note.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      client_id: '',
      service_id: '',
      session_date: '',
      duration_minutes: 60,
      notes: '',
      goals: '',
      progress_notes: '',
      next_steps: '',
      mood_rating: 5,
      energy_level: 5,
      pain_level: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await updateSessionNote(editingNote.id, formData);
        setEditingNote(null);
      } else {
        await addSessionNote(formData);
        setShowAddNote(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving session note:', error);
    }
  };

  const handleEdit = (note: SessionNote) => {
    setEditingNote(note);
    setFormData({
      client_id: note.client_id,
      service_id: note.service_id || '',
      session_date: note.session_date,
      duration_minutes: note.duration_minutes || 60,
      notes: note.notes,
      goals: note.goals || '',
      progress_notes: note.progress_notes || '',
      next_steps: note.next_steps || '',
      mood_rating: note.mood_rating || 5,
      energy_level: note.energy_level || 5,
      pain_level: note.pain_level || 0,
    });
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this session note?')) {
      try {
        await deleteSessionNote(noteId);
      } catch (error) {
        console.error('Error deleting session note:', error);
      }
    }
  };

  const SessionNoteForm = ({
    isEditing = false,
    onClose,
  }: {
    isEditing: boolean;
    onClose: () => void;
  }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-teal-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-teal-900'>
              {isEditing ? 'Edit Session Note' : 'New Session Note'}
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
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Client *</label>
              <select
                required
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
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
              <label className='block text-sm font-medium text-teal-700 mb-2'>Service</label>
              <select
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
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
              <label className='block text-sm font-medium text-teal-700 mb-2'>Session Date *</label>
              <input
                type='date'
                required
                value={formData.session_date}
                onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>
              Duration (minutes)
            </label>
            <input
              type='number'
              min='1'
              value={formData.duration_minutes}
              onChange={(e) =>
                setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })
              }
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Session Notes *</label>
            <textarea
              required
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              placeholder='Describe what happened during the session...'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Goals</label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                rows={3}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                placeholder='Session goals and objectives...'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>Progress Notes</label>
              <textarea
                value={formData.progress_notes}
                onChange={(e) => setFormData({ ...formData, progress_notes: e.target.value })}
                rows={3}
                className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                placeholder='Client progress and improvements...'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700 mb-2'>Next Steps</label>
            <textarea
              value={formData.next_steps}
              onChange={(e) => setFormData({ ...formData, next_steps: e.target.value })}
              rows={3}
              className='w-full px-3 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              placeholder='Recommendations and next steps...'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>
                Mood Rating (1-10)
              </label>
              <input
                type='range'
                min='1'
                max='10'
                value={formData.mood_rating}
                onChange={(e) =>
                  setFormData({ ...formData, mood_rating: parseInt(e.target.value) })
                }
                className='w-full'
              />
              <div className='text-center text-sm text-teal-600 mt-1'>
                {formData.mood_rating}/10
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>
                Energy Level (1-10)
              </label>
              <input
                type='range'
                min='1'
                max='10'
                value={formData.energy_level}
                onChange={(e) =>
                  setFormData({ ...formData, energy_level: parseInt(e.target.value) })
                }
                className='w-full'
              />
              <div className='text-center text-sm text-teal-600 mt-1'>
                {formData.energy_level}/10
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-teal-700 mb-2'>
                Pain Level (0-10)
              </label>
              <input
                type='range'
                min='0'
                max='10'
                value={formData.pain_level}
                onChange={(e) => setFormData({ ...formData, pain_level: parseInt(e.target.value) })}
                className='w-full'
              />
              <div className='text-center text-sm text-teal-600 mt-1'>{formData.pain_level}/10</div>
            </div>
          </div>

          <div className='flex justify-end space-x-3 pt-4 border-t border-teal-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-teal-600 border border-teal-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
            >
              {isEditing ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const NoteModal = ({ note, onClose }: { note: SessionNote; onClose: () => void }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-teal-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-teal-900'>Session Note</h2>
              <p className='text-teal-600'>
                {note.clients
                  ? `${note.clients.first_name} ${note.clients.last_name}`
                  : 'Unknown Client'}{' '}
                - {note.session_date}
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-teal-400 hover:text-teal-600 transition-colors text-2xl'
            >
              ×
            </button>
          </div>
        </div>

        <div className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-blue-900 mb-2'>Duration</h4>
              <p className='text-blue-700'>{note.duration_minutes} minutes</p>
            </div>
            <div className='bg-teal-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-teal-900 mb-2'>Mood</h4>
              <p className='text-teal-700'>{note.mood_rating}/10</p>
            </div>
            <div className='bg-purple-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-purple-900 mb-2'>Energy</h4>
              <p className='text-purple-700'>{note.energy_level}/10</p>
            </div>
          </div>

          <div>
            <h3 className='font-semibold text-teal-900 mb-3'>Session Notes</h3>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-teal-700 leading-relaxed'>{note.notes}</p>
            </div>
          </div>

          {(note.goals || note.progress_notes) && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {note.goals && (
                <div>
                  <h3 className='font-semibold text-teal-900 mb-3'>Goals</h3>
                  <div className='bg-amber-50 p-4 rounded-lg'>
                    <p className='text-amber-700'>{note.goals}</p>
                  </div>
                </div>
              )}
              {note.progress_notes && (
                <div>
                  <h3 className='font-semibold text-teal-900 mb-3'>Progress Notes</h3>
                  <div className='bg-green-50 p-4 rounded-lg'>
                    <p className='text-green-700'>{note.progress_notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {note.next_steps && (
            <div>
              <h3 className='font-semibold text-teal-900 mb-3'>Next Steps</h3>
              <div className='bg-blue-50 p-4 rounded-lg'>
                <p className='text-blue-700'>{note.next_steps}</p>
              </div>
            </div>
          )}
        </div>
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
          <h1 className='text-3xl font-bold text-teal-900'>Session Notes</h1>
          <p className='text-teal-600 mt-1'>Track progress and document wellness sessions</p>
        </div>
        <button
          onClick={() => setShowAddNote(true)}
          className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center'
        >
          <Plus size={20} className='mr-2' />
          New Note
        </button>
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-teal-100'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1 relative'>
            <Search size={20} className='absolute left-3 top-3 text-teal-400' />
            <input
              type='text'
              placeholder='Search notes...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>
          <button className='flex items-center px-4 py-2 border border-teal-200 rounded-lg hover:bg-gray-50 transition-colors'>
            <Filter size={20} className='mr-2' />
            Filter
          </button>
        </div>
      </div>

      {/* Session Notes Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className='bg-white rounded-xl p-6 shadow-sm border border-teal-100 hover:shadow-md transition-shadow duration-200'
          >
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-teal-100 rounded-lg'>
                  <FileText size={20} className='text-teal-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-teal-900'>
                    {note.services ? note.services.name : 'Session'}
                  </h3>
                  <p className='text-sm text-teal-600'>
                    {note.clients
                      ? `${note.clients.first_name} ${note.clients.last_name}`
                      : 'Unknown Client'}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => handleEdit(note)}
                  className='text-blue-600 hover:text-blue-700 transition-colors'
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className='text-red-600 hover:text-red-700 transition-colors'
                >
                  <Trash2 size={16} />
                </button>
                <span className='text-sm text-teal-500'>{note.session_date}</span>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-teal-600'>Duration: {note.duration_minutes} min</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-teal-600'>Mood: {note.mood_rating}/10</span>
                  <span className='text-teal-600'>Energy: {note.energy_level}/10</span>
                </div>
              </div>

              <p className='text-teal-700 text-sm line-clamp-3'>{note.notes}</p>

              <div className='flex items-center justify-between pt-3 border-t border-teal-100'>
                <div className='text-sm text-teal-600'>
                  {note.pain_level && note.pain_level > 0 && (
                    <span>Pain: {note.pain_level}/10</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNote(note)}
                  className='text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors'
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-teal-100'>
        <h2 className='text-xl font-semibold text-teal-900 mb-4'>Recent Session Activity</h2>
        <div className='space-y-3'>
          {sessionNotes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <User size={16} className='text-blue-600' />
                </div>
                <div>
                  <p className='font-medium text-teal-900'>
                    {note.clients
                      ? `${note.clients.first_name} ${note.clients.last_name}`
                      : 'Unknown Client'}
                  </p>
                  <p className='text-sm text-teal-600'>
                    {note.services ? note.services.name : 'Session'}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-teal-900'>{note.session_date}</p>
                <p className='text-sm text-teal-500'>{note.duration_minutes} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <SessionNoteForm
          isEditing={false}
          onClose={() => {
            setShowAddNote(false);
            resetForm();
          }}
        />
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <SessionNoteForm
          isEditing={true}
          onClose={() => {
            setEditingNote(null);
            resetForm();
          }}
        />
      )}

      {/* Note Details Modal */}
      {selectedNote && <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />}
    </div>
  );
};

export default SessionNotes;
