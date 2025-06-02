import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL env variable not found');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY env variable not found');
}

// Supabase istemcisini daha fazla kontrol ile yapılandırıyoruz
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      fetch: async (url, options = {}) => {
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Cache-Control': 'no-cache',
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            console.error(`Supabase HTTP Error: ${response.status} ${response.statusText}`, { url });
          }
          
          return response;
        } catch (error) {
          console.error("Supabase fetch error:", error);
          throw error;
        }
      },
    },
  }
);

export const TABLES = {
  COMPANIES: 'companies',
  ENVIRONMENTS: 'environments',
  TEMPLATES: 'qr_templates',
  TAGS: 'tags',
};