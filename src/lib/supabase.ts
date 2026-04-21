import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env'
  );
}

/**
 * Custom fetch wrapper that aborts requests after 10 seconds.
 * This prevents getSession() / any Supabase call from hanging the app
 * when the project is paused, the URL is wrong, or the network is slow.
 */
const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: fetchWithTimeout,
  },
  auth: {
    // Persist session in localStorage (Supabase default — do NOT change)
    persistSession: true,
    // Don't auto-refresh when the tab is in the background
    autoRefreshToken: true,
    // We handle the URL hash ourselves via onAuthStateChange
    detectSessionInUrl: true,
  },
});
