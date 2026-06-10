"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/supabase/auth";

const URGENCIES = ["low", "72_hours", "urgent"];

/** Shared parser for the create / edit task forms. */
function parseTaskForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");
  const urgencyRaw = String(formData.get("urgency") ?? "low");
  const urgency = URGENCIES.includes(urgencyRaw) ? urgencyRaw : "low";
  const section_id = String(formData.get("section_id") ?? "") || null;
  const assignee_id = String(formData.get("assignee_id") ?? "") || null;

  return { title, description, start, end, urgency, section_id, assignee_id };
}

// ── Tasks ────────────────────────────────────────────────────

export async function createTask(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();
  const f = parseTaskForm(formData);
  if (!f.title || !f.start) return;

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id, // creator, for record-keeping
    title: f.title,
    description: f.description,
    start_time: new Date(f.start).toISOString(),
    end_time: f.end ? new Date(f.end).toISOString() : null,
    urgency: f.urgency,
    section_id: f.section_id,
    assignee_id: f.assignee_id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function updateTask(id: string, formData: FormData) {
  await requireUser();
  const supabase = await createClient();
  const f = parseTaskForm(formData);
  if (!f.title || !f.start) return;

  const { error } = await supabase
    .from("tasks")
    .update({
      title: f.title,
      description: f.description,
      start_time: new Date(f.start).toISOString(),
      end_time: f.end ? new Date(f.end).toISOString() : null,
      urgency: f.urgency,
      section_id: f.section_id,
      assignee_id: f.assignee_id,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

/**
 * Move a task between board columns. `group` decides which field changes:
 * dragging in the Section board sets section_id, the People board sets
 * assignee_id, the Urgency board sets urgency.
 */
export async function moveTask(
  id: string,
  group: "section" | "assignee" | "urgency",
  value: string | null,
) {
  await requireUser();
  const supabase = await createClient();

  const patch: Record<string, string | null> = {};
  if (group === "section") patch.section_id = value || null;
  else if (group === "assignee") patch.assignee_id = value || null;
  else if (group === "urgency")
    patch.urgency = URGENCIES.includes(value ?? "") ? (value as string) : "low";
  else return;

  const { error } = await supabase.from("tasks").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function toggleTask(id: string, completed: boolean) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function deleteTask(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

// ── Sections ─────────────────────────────────────────────────

export async function addSection(formData: FormData) {
  await requireUser();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const { data } = await supabase
    .from("sections")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (data?.[0]?.sort_order ?? -1) + 1;

  const { error } = await supabase
    .from("sections")
    .insert({ name, sort_order: nextOrder });

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function deleteSection(id: string) {
  await requireUser();
  const supabase = await createClient();
  // Tasks in this section have section_id set to null (FK on delete set null).
  const { error } = await supabase.from("sections").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

// ── Team members ─────────────────────────────────────────────

export async function addMember(formData: FormData) {
  await requireUser();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const { error } = await supabase.from("team_members").insert({ name });

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function removeMember(id: string) {
  await requireUser();
  const supabase = await createClient();
  // Tasks assigned to this member have assignee_id set to null.
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}
