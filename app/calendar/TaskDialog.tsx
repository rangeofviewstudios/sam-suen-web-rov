"use client";

import { useTransition } from "react";
import {
  URGENCY_META,
  URGENCY_ORDER,
  type Section,
  type Task,
  type TeamMember,
} from "./types";
import { createTask, updateTask } from "./actions";
import { nowLocal, toLocal } from "./ui";
import AnimatedGenerateButton from "@/app/components/ui/animated-generate-button-shadcn-tailwind";
import styles from "./calendar.module.css";

export type TaskDefaults = {
  section_id?: string | null;
  assignee_id?: string | null;
  urgency?: string;
  start?: string;
};

export default function TaskDialog({
  task,
  defaults,
  sections,
  members,
  onClose,
}: {
  task?: Task;
  defaults?: TaskDefaults;
  sections: Section[];
  members: TeamMember[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(task);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (task) await updateTask(task.id, formData);
      else await createTask(formData);
      onClose();
    });
  }

  const startDefault = task
    ? toLocal(task.start_time)
    : (defaults?.start ?? nowLocal());
  const endDefault = task?.end_time ? toLocal(task.end_time) : "";
  const sectionDefault = task?.section_id ?? defaults?.section_id ?? "";
  const assigneeDefault = task?.assignee_id ?? defaults?.assignee_id ?? "";
  const urgencyDefault = task?.urgency ?? defaults?.urgency ?? "low";

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className={styles.dialogTitle}>{isEdit ? "Edit task" : "New task"}</h2>
        <form action={handleSubmit} className={styles.dialogForm}>
          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Title</label>
            <input
              name="title"
              className={styles.input}
              required
              autoFocus
              defaultValue={task?.title ?? ""}
              placeholder="What needs doing?"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Section</label>
            <select
              name="section_id"
              className={styles.select}
              defaultValue={sectionDefault}
            >
              <option value="">— None —</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Assignee</label>
            <select
              name="assignee_id"
              className={styles.select}
              defaultValue={assigneeDefault}
            >
              <option value="">— Unassigned —</option>
              {members.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Urgency</label>
            <select
              name="urgency"
              className={styles.select}
              defaultValue={urgencyDefault}
            >
              {URGENCY_ORDER.map((u) => (
                <option key={u} value={u}>
                  {URGENCY_META[u].label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Start</label>
            <input
              name="start"
              type="datetime-local"
              className={styles.input}
              required
              defaultValue={startDefault}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>End (optional)</label>
            <input
              name="end"
              type="datetime-local"
              className={styles.input}
              defaultValue={endDefault}
            />
          </div>

          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Description (optional)</label>
            <input
              name="description"
              className={styles.input}
              defaultValue={task?.description ?? ""}
              placeholder="Notes…"
            />
          </div>

          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.ghostButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <AnimatedGenerateButton
              type="submit"
              disabled={isPending}
              generating={isPending}
              labelIdle={isEdit ? "Save" : "Create task"}
              labelActive={isEdit ? "Saving" : "Creating"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
