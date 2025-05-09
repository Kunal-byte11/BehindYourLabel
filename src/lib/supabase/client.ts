
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define a function to create a Supabase client for client-side operations
// This ensures that the client is created only on the browser.
let client: SupabaseClient | undefined;

export function createClient() {
  if (typeof window === 'undefined') {
    // This function should not be called on the server
    // For server-side, use createServerClient from '@supabase/ssr'
    // or a dedicated server client setup.
    // However, for this app, auth is primarily client-driven for pages.
    throw new Error('Supabase client creation attempted on the server. Use a server client instead.');
  }
  
  if (client) {
    return client;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase URL or Anon Key');
  }

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  return client;
}
