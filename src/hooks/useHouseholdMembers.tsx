
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface HouseholdMember {
  id: string;
  user_id: string;
  household_id: string;
  role: string;
  profiles: {
    name: string;
    avatar_url?: string;
  };
}

export const useHouseholdMembers = (householdId?: string) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !householdId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('household_members')
          .select(`
            *,
            profiles (
              name,
              avatar_url
            )
          `)
          .eq('household_id', householdId);

        if (error) {
          console.error('Error fetching household members:', error);
        } else {
          setMembers(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user, householdId]);

  return { members, loading };
};
