import { getSupabaseClient } from "@/lib/supabase";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";

export async function listInquiries(): Promise<Inquiry[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data as Inquiry[];
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from("inquiries")
    .update({ status })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function createInquiry(payload: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from("inquiries").insert({
    phone: payload.phone,
    // Note: The schema for inquiries is basic. We combine name/email/subject into the message body for now,
    // or we could add them to the database if the schema gets updated later.
    message: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\n${payload.message}`,
    source: "contact_form",
    status: "new"
  });
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from("subscribers").insert({ email });
  
  if (error) {
    if (error.code === '23505') { // postgres unique violation
      throw new Error("This email is already subscribed.");
    }
    throw new Error(error.message);
  }
}
