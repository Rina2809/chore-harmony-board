
-- Add foreign key relationship between chore_assignments and profiles
ALTER TABLE public.chore_assignments 
ADD CONSTRAINT chore_assignments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable realtime for chore_assignments table
ALTER TABLE public.chore_assignments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chore_assignments;
