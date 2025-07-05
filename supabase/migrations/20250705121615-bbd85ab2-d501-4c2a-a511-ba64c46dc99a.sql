
-- Add foreign key relationship between household_members and profiles
ALTER TABLE public.household_members 
ADD CONSTRAINT household_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
