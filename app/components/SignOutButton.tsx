import { signOut } from "@/app/auth/actions";

/**
 * Minimal sign-out button. Drop it into any Server or Client Component;
 * it posts to the `signOut` server action. Pass `className` to style the
 * button for the surrounding surface.
 */
export default function SignOutButton({
  className,
}: {
  className?: string;
}) {
  return (
    <form action={signOut}>
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}
