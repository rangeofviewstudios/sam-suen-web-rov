import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

/**
 * OAuth (and email-confirmation) callback. Supabase redirects the browser
 * here with a `?code=...` after the user authenticates with the provider.
 * We exchange that code for a session (cookies are set by the server client)
 * and forward the user on to `next` (defaults to /calendar).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/calendar";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // No load balancer in front of the dev server.
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // No code, or the exchange failed.
  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
