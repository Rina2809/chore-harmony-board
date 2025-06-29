
-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create households table
CREATE TABLE public.households (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create household_members table for many-to-many relationship
CREATE TABLE public.household_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES public.households ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(household_id, user_id)
);

-- Create chores table
CREATE TABLE public.chores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  hate_points INTEGER NOT NULL DEFAULT 1 CHECK (hate_points >= 1 AND hate_points <= 7),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  recurring TEXT DEFAULT 'none' CHECK (recurring IN ('none', 'daily', 'weekly', 'monthly')),
  due_date TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  household_id UUID REFERENCES public.households ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chore_assignments table for many-to-many relationship
CREATE TABLE public.chore_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chore_id UUID REFERENCES public.chores ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chore_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chore_assignments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Households policies
CREATE POLICY "Users can view households they belong to" ON public.households
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = public.households.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create households" ON public.households
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Household creators can update their households" ON public.households
  FOR UPDATE USING (auth.uid() = created_by);

-- Household members policies
CREATE POLICY "Users can view household members for their households" ON public.household_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.household_members hm2
      WHERE hm2.household_id = public.household_members.household_id 
      AND hm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join households" ON public.household_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chores policies
CREATE POLICY "Users can view chores in their households" ON public.chores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = public.chores.household_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chores in their households" ON public.chores
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = public.chores.household_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update chores in their households" ON public.chores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = public.chores.household_id 
      AND user_id = auth.uid()
    )
  );

-- Chore assignments policies
CREATE POLICY "Users can view chore assignments in their households" ON public.chore_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chores c
      JOIN public.household_members hm ON c.household_id = hm.household_id
      WHERE c.id = public.chore_assignments.chore_id 
      AND hm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can assign chores in their households" ON public.chore_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chores c
      JOIN public.household_members hm ON c.household_id = hm.household_id
      WHERE c.id = public.chore_assignments.chore_id 
      AND hm.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for all tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.households REPLICA IDENTITY FULL;
ALTER TABLE public.household_members REPLICA IDENTITY FULL;
ALTER TABLE public.chores REPLICA IDENTITY FULL;
ALTER TABLE public.chore_assignments REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.households;
ALTER PUBLICATION supabase_realtime ADD TABLE public.household_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chore_assignments;
