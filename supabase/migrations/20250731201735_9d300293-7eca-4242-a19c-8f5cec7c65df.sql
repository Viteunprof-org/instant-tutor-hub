-- Enable RLS on all existing tables
ALTER TABLE public.old_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matters_old_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matter_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_intervals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_progresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels_old_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_to_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typeorm_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create profiles table for authenticated users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher')),
  parent_type TEXT CHECK (parent_type IN ('student', 'parent')),
  phone TEXT,
  school TEXT,
  graduation_year TEXT,
  biography TEXT,
  experience TEXT,
  education TEXT,
  whatsapp_number TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create subjects table for teacher specializations
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create teacher_subjects junction table
CREATE TABLE public.teacher_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  levels TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id)
);

-- Enable RLS on teacher_subjects
ALTER TABLE public.teacher_subjects ENABLE ROW_LEVEL SECURITY;

-- Create lesson_requests table
CREATE TABLE public.lesson_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL DEFAULT 60,
  description TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'in-progress', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on lesson_requests
ALTER TABLE public.lesson_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for subjects (public read, admin write)
CREATE POLICY "Anyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

-- Create RLS policies for teacher_subjects
CREATE POLICY "Teachers can manage their own subjects" ON public.teacher_subjects
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Anyone can view teacher subjects" ON public.teacher_subjects
  FOR SELECT USING (true);

-- Create RLS policies for lesson_requests
CREATE POLICY "Students can view their own requests" ON public.lesson_requests
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view requests assigned to them" ON public.lesson_requests
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Students can create lesson requests" ON public.lesson_requests
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own requests" ON public.lesson_requests
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Teachers can update assigned requests" ON public.lesson_requests
  FOR UPDATE USING (auth.uid() = teacher_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_requests_updated_at
  BEFORE UPDATE ON public.lesson_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default subjects
INSERT INTO public.subjects (name, category, icon) VALUES
('Mathématiques', 'Sciences', '📐'),
('Physique', 'Sciences', '⚛️'),
('Chimie', 'Sciences', '🧪'),
('Français', 'Langues', '📚'),
('Anglais', 'Langues', '🇬🇧'),
('Histoire', 'Sciences Humaines', '📜'),
('Géographie', 'Sciences Humaines', '🌍'),
('Philosophie', 'Sciences Humaines', '💭'),
('Économie', 'Sciences Sociales', '📊'),
('Informatique', 'Technologies', '💻');

-- Restrict access to old legacy tables for now (they should be migrated later)
CREATE POLICY "Admin only access" ON public.users FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.old_teachers FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.matters_old_teachers FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.matter_levels FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.reviews FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.courses FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.course_logins FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.discount_intervals FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.events FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.playlists FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.logs FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.partners FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.matters FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.packs FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.notification_tokens FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.downloads FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.tracks FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.workspace_progresses FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.levels FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.levels_old_teachers FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.discount_to_users FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.discounts FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.settings FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.referral_codes FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.files FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.typeorm_metadata FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.questions FOR ALL USING (false);