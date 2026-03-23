import { adminAllowlist, isSupabaseConfigured, supabase } from "@/lib/supabase";

const LOCAL_ADMIN_KEY = "karh_local_admin";

export async function signIn(email: string, password: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return;
  }
  if (!email || !password || password.length < 4) {
    throw new Error("Invalid credentials");
  }
  localStorage.setItem(LOCAL_ADMIN_KEY, email.toLowerCase());
}

export async function signOut() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return;
  }
  localStorage.removeItem(LOCAL_ADMIN_KEY);
}

export async function getCurrentAdminEmail(): Promise<string | null> {
  if (isSupabaseConfigured && supabase) {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user?.email?.toLowerCase() || null;
  }
  return localStorage.getItem(LOCAL_ADMIN_KEY);
}

export function isAdminEmailAllowed(email: string | null) {
  if (!email) {
    return false;
  }
  if (!adminAllowlist.length) {
    return true;
  }
  return adminAllowlist.includes(email.toLowerCase());
}
