# QR Code Store

A modern web application for storing and managing QR codes using Supabase as the backend.

## Project Description

This project allows users to create, store, and manage QR codes. The backend is powered by Supabase, providing authentication and database services.

## Requirements

- Node.js (v16 or higher recommended)
- npm or yarn
- Supabase account (https://supabase.com)

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Backend as a Service)

## Features

- Company and environment management
- QR code template creation
- Storing QR codes in the database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/qr-code-store.git
   cd qr-code-store
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Supabase Setup

### 1. Create a Supabase Project

- Go to [Supabase](https://app.supabase.com/).
- Click on "New Project".
- Enter your project details and create the project.

### 2. Get Your Supabase API Keys

- In your Supabase project dashboard, go to **Project Settings > API**.
- Copy the **Project URL** and **anon public key**.
- Create a `.env.local` file in your project root and add:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

### 3. Run Initial SQL in Supabase

- Go to your Supabase project dashboard.
- Click on **SQL Editor** > **New Query**.
- Paste and run the following SQL to create the required tables:

#### lib/supabase/schema.sql

```sql
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
```

## Running the Project

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Open your browser and go to `http://localhost:3000`.

## Notes

- Make sure your Supabase credentials are correct in the `.env.local` file.
- For production, review Supabase security policies and environment variable management.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
