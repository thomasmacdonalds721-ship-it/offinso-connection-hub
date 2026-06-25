import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseClient: any;

function createMockSupabaseClient() {
  const dummyPromise = Promise.resolve({ data: null, error: null });
  const dummyChannel = {
    on: () => dummyChannel,
    subscribe: () => ({ unsubscribe: () => {} }),
    unsubscribe: () => {}
  };

  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'auth') {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase is not configured.') }),
          signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase is not configured.') }),
          signOut: () => Promise.resolve({ error: null }),
          resetPasswordForEmail: () => Promise.resolve({ error: new Error('Supabase is not configured.') }),
        };
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({
            order: () => dummyPromise,
            eq: () => dummyPromise,
            single: () => dummyPromise,
          }),
          insert: () => dummyPromise,
          update: () => ({ eq: () => dummyPromise }),
          delete: () => ({ eq: () => dummyPromise }),
        });
      }
      if (prop === 'rpc') {
        return () => dummyPromise;
      }
      if (prop === 'channel') {
        return () => dummyChannel;
      }
      return () => dummyPromise;
    }
  };

  return new Proxy({}, handler);
}

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabaseClient = createMockSupabaseClient();
  }
} else {
  console.warn('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  supabaseClient = createMockSupabaseClient();
}

export const supabase = supabaseClient;

