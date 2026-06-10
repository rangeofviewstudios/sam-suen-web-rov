"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

/**
 * Signs the current user out and sends them to the login page.
 * Use as a form action: <form action={signOut}><button>Sign out</button></form>
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
