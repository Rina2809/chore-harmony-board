
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Chore {
  id: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  hate_points: number;
  priority: 'low' | 'medium' | 'high';
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  due_date?: string;
  is_completed: boolean;
  completed_at?: string;
  household_id: string;
  created_by: string;
  assignments: Array<{
    user_id: string;
    profiles: {
      name: string;
      avatar_url?: string;
    };
  }>;
}

export const useChores = (householdId?: string) => {
  const { user } = useAuth();
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !householdId) {
      setChores([]);
      setLoading(false);
      return;
    }

    const fetchChores = async () => {
      try {
        const { data, error } = await supabase
          .from('chores')
          .select(`
            *,
            chore_assignments (
              user_id,
              profiles (
                name,
                avatar_url
              )
            )
          `)
          .eq('household_id', householdId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching chores:', error);
        } else {
          setChores(data?.map(chore => ({
            ...chore,
            assignments: chore.chore_assignments || []
          })) || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChores();

    // Set up realtime subscription
    const channel = supabase
      .channel('chores-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chores',
        filter: `household_id=eq.${householdId}`
      }, () => {
        fetchChores();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chore_assignments'
      }, () => {
        fetchChores();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, householdId]);

  const addChore = async (choreData: Partial<Chore>) => {
    if (!user || !householdId) return { error: 'Missing user or household' };

    try {
      const { data, error } = await supabase
        .from('chores')
        .insert({
          ...choreData,
          household_id: householdId,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chore:', error);
        return { error };
      }

      // Assign to current user by default
      if (data) {
        await supabase
          .from('chore_assignments')
          .insert({
            chore_id: data.id,
            user_id: user.id
          });
      }

      return { error: null };
    } catch (error) {
      console.error('Error:', error);
      return { error };
    }
  };

  const updateChore = async (choreId: string, updates: Partial<Chore>) => {
    try {
      const { error } = await supabase
        .from('chores')
        .update(updates)
        .eq('id', choreId);

      if (error) {
        console.error('Error updating chore:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error:', error);
      return { error };
    }
  };

  const toggleComplete = async (choreId: string) => {
    const chore = chores.find(c => c.id === choreId);
    if (!chore) return { error: 'Chore not found' };

    const isCompleting = !chore.is_completed;
    
    try {
      const { error } = await supabase
        .from('chores')
        .update({
          is_completed: isCompleting,
          completed_at: isCompleting ? new Date().toISOString() : null
        })
        .eq('id', choreId);

      if (error) {
        console.error('Error toggling chore completion:', error);
        return { error };
      }

      // Create new recurring chore if completing and it's recurring
      if (isCompleting && chore.recurring && chore.recurring !== 'none') {
        const newDueDate = new Date();
        switch (chore.recurring) {
          case 'daily':
            newDueDate.setDate(newDueDate.getDate() + 1);
            break;
          case 'weekly':
            newDueDate.setDate(newDueDate.getDate() + 7);
            break;
          case 'monthly':
            newDueDate.setMonth(newDueDate.getMonth() + 1);
            break;
        }

        await supabase
          .from('chores')
          .insert({
            title: chore.title,
            description: chore.description,
            category: chore.category,
            icon: chore.icon,
            hate_points: chore.hate_points,
            priority: chore.priority,
            recurring: chore.recurring,
            due_date: newDueDate.toISOString(),
            household_id: chore.household_id,
            created_by: chore.created_by,
            is_completed: false
          });
      }

      return { error: null };
    } catch (error) {
      console.error('Error:', error);
      return { error };
    }
  };

  return { chores, addChore, updateChore, toggleComplete, loading };
};
