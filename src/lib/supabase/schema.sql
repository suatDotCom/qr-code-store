CREATE TABLE IF NOT EXISTS public.tags (
  id uuid NOT NULL PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.qr_templates (
  id uuid NOT NULL PRIMARY KEY,
  name text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'url')),
  tag_ids text[] DEFAULT '{}'::text[],
  style jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_template boolean DEFAULT true NOT NULL,
  thumbnail text
);

-- RLS (Row Level Security) settings
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public tags access" ON public.tags FOR ALL USING (true);
CREATE POLICY "Public qr_templates access" ON public.qr_templates FOR ALL USING (true);

CREATE OR REPLACE FUNCTION create_tags_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.tags (
    id uuid NOT NULL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public tags access" ON public.tags FOR ALL USING (true);
END;
$$;

CREATE OR REPLACE FUNCTION create_qr_templates_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.qr_templates (
    id uuid NOT NULL PRIMARY KEY,
    name text NOT NULL,
    content text NOT NULL,
    type text NOT NULL CHECK (type IN ('text', 'url')),
    tag_ids text[] DEFAULT '{}'::text[],
    style jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_template boolean DEFAULT true NOT NULL,
    thumbnail text
  );
  
  ALTER TABLE public.qr_templates ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public qr_templates access" ON public.qr_templates FOR ALL USING (true);
END;
$$;

CREATE OR REPLACE FUNCTION setup_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM create_tags_table();
  PERFORM create_qr_templates_table();
END;
$$; 