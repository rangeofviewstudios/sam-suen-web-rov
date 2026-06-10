import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

/**
 * Returns the current authenticated user, or null if not signed in.
 * Safe to call from Server Components, Route Handlers, and Server Actions.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Guard for protected pages. Returns the user if authenticated,
 * otherwise redirects to /login (which never returns).
 *
 * Usage in a protected Server Component:
 *   const user = await requireUser();
 */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
