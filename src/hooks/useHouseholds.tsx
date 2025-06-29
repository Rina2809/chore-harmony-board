
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Household {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export const useHouseholds = () => {
  const { user } = useAuth();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHouseholds([]);
      setLoading(false);
      return;
    }

    const fetchHouseholds = async () => {
      try {
        const { data, error } = await supabase
          .from('households')
          .select(`
            id,
            name,
            description,
            created_by,
            created_at,
            household_members!inner(user_id)
          `)
          .eq('household_members.user_id', user.id);

        if (error) {
          console.error('Error fetching households:', error);
        } else {
          setHouseholds(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds();

    // Set up realtime subscription
    const channel = supabase
      .channel('households-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'households'
      }, () => {
        fetchHouseholds();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'household_members'
      }, () => {
        fetchHouseholds();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { households, loading };
};
