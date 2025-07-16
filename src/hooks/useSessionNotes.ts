import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../lib/database.types';

type SessionNote = Database['public']['Tables']['session_notes']['Row'] & {
  clients?: { first_name: string; last_name: string };
  services?: { name: string };
};
type SessionNoteInsert = Database['public']['Tables']['session_notes']['Insert'];
type SessionNoteUpdate = Database['public']['Tables']['session_notes']['Update'];

export const useSessionNotes = () => {
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSessionNotes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('session_notes')
        .select(`
          *,
          clients (first_name, last_name),
          services (name)
        `)
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setSessionNotes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSessionNote = async (noteData: Omit<SessionNoteInsert, 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('session_notes')
        .insert({ ...noteData, user_id: user.id })
        .select(`
          *,
          clients (first_name, last_name),
          services (name)
        `)
        .single();

      if (error) throw error;
      setSessionNotes(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateSessionNote = async (id: string, updates: SessionNoteUpdate) => {
    try {
      const { data, error } = await supabase
        .from('session_notes')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          clients (first_name, last_name),
          services (name)
        `)
        .single();

      if (error) throw error;
      setSessionNotes(prev => prev.map(note => note.id === id ? data : note));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSessionNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('session_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSessionNotes(prev => prev.filter(note => note.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSessionNotes();
  }, [user]);

  return {
    sessionNotes,
    loading,
    error,
    addSessionNote,
    updateSessionNote,
    deleteSessionNote,
    refetch: fetchSessionNotes
  };
};