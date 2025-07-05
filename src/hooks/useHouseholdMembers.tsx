
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
  } | null;
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
        console.log('Fetching household members for household:', householdId);
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
          setMembers([]);
        } else {
          console.log('Household members data:', data);
          // Filter out members without valid profiles
          const validMembers = (data || []).filter(member => member.profiles !== null);
          setMembers(validMembers);
        }
      } catch (error) {
        console.error('Error:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user, householdId]);

  return { members, loading };
};
