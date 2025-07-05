
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
  created_at?: string;
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
        console.log('Fetching chores for household:', householdId);
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
          console.log('Raw chore data from database:', data);
          const transformedChores = data?.map(chore => ({
            ...chore,
            priority: chore.priority as 'low' | 'medium' | 'high',
            recurring: chore.recurring as 'none' | 'daily' | 'weekly' | 'monthly',
            assignments: chore.chore_assignments?.map((assignment: any) => ({
              user_id: assignment.user_id,
              profiles: assignment.profiles || { name: 'Unknown', avatar_url: null }
            })) || []
          })) || [];
          console.log('Transformed chores:', transformedChores);
          setChores(transformedChores);
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

  const addChore = async (choreData: Partial<Chore> & { assignees?: string[] }) => {
    if (!user || !householdId) return { error: 'Missing user or household' };

    try {
      // Prepare data for database insert
      const insertData = {
        title: choreData.title || '',
        description: choreData.description,
        category: choreData.category || '',
        icon: choreData.icon || '',
        hate_points: choreData.hate_points || 1,
        priority: choreData.priority || 'medium',
        recurring: choreData.recurring || 'none',
        due_date: choreData.due_date,
        household_id: householdId,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('chores')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating chore:', error);
        return { error };
      }

      // Handle assignees
      if (data && choreData.assignees && choreData.assignees.length > 0) {
        const assignments = choreData.assignees.map(userId => ({
          chore_id: data.id,
          user_id: userId
        }));

        const { error: assignmentError } = await supabase
          .from('chore_assignments')
          .insert(assignments);

        if (assignmentError) {
          console.error('Error creating assignments:', assignmentError);
        }
      } else if (data) {
        // Assign to current user by default if no assignees specified
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

  const updateChore = async (choreId: string, updates: Partial<Chore> & { assignees?: string[] }) => {
    try {
      // Prepare updates for database
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.hate_points !== undefined) updateData.hate_points = updates.hate_points;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.recurring !== undefined) updateData.recurring = updates.recurring;
      if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
      if (updates.is_completed !== undefined) updateData.is_completed = updates.is_completed;
      if (updates.completed_at !== undefined) updateData.completed_at = updates.completed_at;

      const { error } = await supabase
        .from('chores')
        .update(updateData)
        .eq('id', choreId);

      if (error) {
        console.error('Error updating chore:', error);
        return { error };
      }

      // Handle assignee updates if provided
      if (updates.assignees !== undefined) {
        // First, remove existing assignments
        await supabase
          .from('chore_assignments')
          .delete()
          .eq('chore_id', choreId);

        // Then add new assignments
        if (updates.assignees.length > 0) {
          const assignments = updates.assignees.map(userId => ({
            chore_id: choreId,
            user_id: userId
          }));

          const { error: assignmentError } = await supabase
            .from('chore_assignments')
            .insert(assignments);

          if (assignmentError) {
            console.error('Error updating assignments:', assignmentError);
          }
        }
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
