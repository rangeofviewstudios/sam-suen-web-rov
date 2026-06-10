import Image from "next/image";
import { requireUser } from "@/app/lib/supabase/auth";
import { createClient } from "@/app/lib/supabase/server";
import SignOutButton from "@/app/components/SignOutButton";
import GradientBackground from "@/app/components/GradientBackground";
import CalendarClient from "./CalendarClient";
import type { Section, Task, TeamMember } from "./types";
import styles from "./calendar.module.css";

export default async function CalendarPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [tasksRes, sectionsRes, membersRes] = await Promise.all([
    supabase.from("tasks").select("*").order("start_time", { ascending: true }),
    supabase.from("sections").select("*").order("sort_order", { ascending: true }),
    supabase.from("team_members").select("*").order("name", { ascending: true }),
  ]);

  return (
    <main className={styles.page}>
      <GradientBackground />

      <header className={styles.header}>
        <div>
          <Image
            src="/suenlogo.png"
            alt="Sam Suen"
            width={110}
            height={23}
            className={styles.headerLogo}
            priority
          />
          <h1 className={styles.title}>Team Board</h1>
          <p className={styles.user}>{user.email}</p>
        </div>
        <SignOutButton className={styles.signOut} />
      </header>

      <CalendarClient
        initialTasks={(tasksRes.data as Task[]) ?? []}
        sections={(sectionsRes.data as Section[]) ?? []}
        members={(membersRes.data as TeamMember[]) ?? []}
      />
    </main>
  );
}
