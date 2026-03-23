# Customer-Owned Deployment Checklist

## 1) Push to Customer GitHub
1. Open up your terminal in this repository.
2. Link the repository to your customer's GitHub using: `git remote add customer https://github.com/kanyugaireri-oss/Karh-Auto-Sales.git`
3. Push the codebase: `git push -u customer main`

## 2) Configure Customer Supabase
(**Supabase URL:** `https://xmcufvvtlxwwtiwmgtjc.supabase.co`)
1. Create project in customer Supabase account.
2. In the Supabase Dashboard, go to **SQL Editor** and run the following in order:
   - Paste contents of `supabase/schema.sql` and run.
   - Paste contents of `supabase/policies.sql` and run.
3. In **Storage**, create a new bucket named: `car-images` (set it to Public).
4. In **Authentication** -> **Users**, invite or manually add any admin users.
5. In the **Table Editor**, go to the `profiles` table and ensure the admin emails have the role `admin`.

## 3) Configure Customer Vercel
1. Login to customer Vercel account.
2. Import the remote GitHub repository: `kanyugaireri-oss/Karh-Auto-Sales`
3. Add the following Environment Variables before deploying:
   - `VITE_SUPABASE_URL`: `https://xmcufvvtlxwwtiwmgtjc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtY3VmdnZ0bHh3d3Rpd21ndGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTUxMDQsImV4cCI6MjA4ODYzMTEwNH0.ax1w-beRQyEA4p3Q8KQnxP760g1k_gPkGpuq19nQJ8A`
   - `VITE_WHATSAPP_NUMBER`: `254740706831`
   - `VITE_ADMIN_EMAILS`: `karhautosales@gmail.com`
4. Deploy.

## 4) Post-Deploy Validation
1. Public pages load and inventory is visible.
2. Admin login works on mobile.
3. Add car via `Add the Car` and confirm instant public visibility.
4. Test offline admin queue then reconnect and sync.
5. Verify inquiry status updates from admin.
