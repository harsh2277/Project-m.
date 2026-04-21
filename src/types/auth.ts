import type { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  company_name: string | null;
  bio: string | null;
  terms_accepted_at: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | 'first_name'
    | 'last_name'
    | 'avatar_url'
    | 'job_title'
    | 'company_name'
    | 'bio'
    | 'onboarding_completed'
  >
>;

export interface UserSettings {
  user_id: string;
  theme: 'light' | 'dark';
  email_notifications: boolean;
  push_notifications: boolean;
  two_factor_enabled: boolean;
  timezone: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export type UserSettingsUpdate = Partial<
  Pick<
    UserSettings,
    | 'theme'
    | 'email_notifications'
    | 'push_notifications'
    | 'two_factor_enabled'
    | 'timezone'
    | 'language'
  >
>;

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  termsAccepted: boolean;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
  updateSettings: (data: UserSettingsUpdate) => Promise<void>;
}

export type { Session, User };
