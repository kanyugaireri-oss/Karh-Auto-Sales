# Karh Auto Sales (Mobile-First)

Mobile-first rebuild of the Karh Auto Sales site with:
- Public website pages (`/`, `/cars`, `/about`, `/contact`)
- Admin panel for authenticated admins only
- Car inventory CRUD
- Inquiry status management
- Camera/gallery image upload support with compression
- Offline queue + auto-sync for admin create/update flows

## Tech
- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Supabase (Auth, Postgres, Storage)

## Local Run
1. Install dependencies:
   - `npm install`
2. Create env file:
   - copy `.env.example` to `.env`
3. Start dev server:
   - `npm run dev`

If Supabase env vars are not set, the app runs with local fallback storage for development only.

## Supabase Setup (Customer Project Only)
1. Create a Supabase project in customer account.
2. Run SQL in this order:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
3. Create storage bucket:
   - `car-images`
4. In Auth, create admin users.
5. Insert those users into `profiles` with role `admin`.

## Required Environment Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_WHATSAPP_NUMBER`
- `VITE_ADMIN_EMAILS` (comma-separated allowlist)

## Mobile Admin Flow
1. Login at `/admin/login`.
2. Open `/admin/cars`.
3. Tap `Add Car`.
4. Capture/select image, fill details, tap `Add the Car`.
5. Online: record is immediately published.
6. Offline: record is queued, then auto-syncs when network returns.

## Deployment Handoff (Customer-Owned Accounts)
1. Push this repository to customer GitHub repo.
2. Connect that repo to customer Vercel project.
3. Set environment variables in Vercel (customer keys only).
4. Deploy production build.

Do not use personal Supabase/GitHub/Vercel credentials for this project.
