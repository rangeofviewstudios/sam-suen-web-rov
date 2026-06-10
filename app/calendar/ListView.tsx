"use client";

import {
  URGENCY_META,
  type Section,
  type Task,
  type TeamMember,
} from "./types";
import { Avatar, shortDate } from "./ui";
import type { GroupBy } from "./BoardView";
import styles from "./calendar.module.css";

type Group = { key: string; label: string; value: string | null; accent?: string };

export default function ListView({
  tasks,
  sections,
  members,
  groupBy,
  sectionName,
  memberName,
  onEdit,
  onToggle,
  onDelete,
  pending,
}: {
  tasks: Task[];
  sections: Section[];
  members: TeamMember[];
  groupBy: GroupBy;
  sectionName: (id: string | null) => string | null;
  memberName: (id: string | null) => string | null;
  onEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  pending: boolean;
}) {
  const groups: Group[] =
    groupBy === "section"
      ? [
          ...sections.map((s) => ({ key: s.id, label: s.name, value: s.id })),
          { key: "__none", label: "No section", value: null },
        ]
      : groupBy === "assignee"
        ? [
            ...members.map((m) => ({ key: m.id, label: m.name, value: m.id })),
            { key: "__unassigned", label: "Unassigned", value: null },
          ]
        : (["urgent", "72_hours", "low"] as const).map((u) => ({
            key: u,
            label: URGENCY_META[u].label,
            value: u,
            accent: URGENCY_META[u].color,
          }));

  function inGroup(t: Task, g: Group): boolean {
    if (groupBy === "section") return (t.section_id ?? null) === g.value;
    if (groupBy === "assignee") return (t.assignee_id ?? null) === g.value;
    return t.urgency === g.value;
  }

  function sortTasks(a: Task, b: Task): number {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const r =
      (URGENCY_META[b.urgency]?.rank ?? 0) - (URGENCY_META[a.urgency]?.rank ?? 0);
    if (r) return r;
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  }

  return (
    <div className={styles.listView}>
      {groups.map((g) => {
        const rows = tasks.filter((t) => inGroup(t, g)).sort(sortTasks);
        if (rows.length === 0) return null;
        return (
          <section key={g.key} className={styles.listGroup}>
            <div className={styles.listGroupHead}>
              <span
                className={styles.listGroupName}
                style={g.accent ? { color: g.accent } : undefined}
              >
                {g.label}
              </span>
              <span className={styles.listGroupCount}>{rows.length}</span>
            </div>
            <ul className={styles.list}>
              {rows.map((task) => {
                const meta = URGENCY_META[task.urgency] ?? URGENCY_META.low;
                const sName = sectionName(task.section_id);
                const aName = memberName(task.assignee_id);
                return (
                  <li key={task.id} className={styles.item}>
                    <span
                      className={styles.itemStripe}
                      style={{ background: meta.color }}
                    />
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={task.completed}
                      onChange={() => onToggle(task)}
                      disabled={pending}
                    />
                    <div className={styles.itemBody}>
                      <div
                        className={`${styles.itemTitle} ${
                          task.completed ? styles.itemTitleDone : ""
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className={styles.itemMeta}>
                        {shortDate(task.start_time)}
                        {task.description ? ` · ${task.description}` : ""}
                      </div>
                    </div>
                    <div className={styles.itemTagsRow}>
                      {groupBy !== "urgency" && (
                        <span
                          className={`${styles.badge} ${styles.badgeUrgency}`}
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.label}
                        </span>
                      )}
                      {groupBy !== "section" && sName && (
                        <span className={styles.badge}>{sName}</span>
                      )}
                      {groupBy !== "assignee" && <Avatar name={aName} />}
                    </div>
                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => onEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.linkButton} ${styles.linkDanger}`}
                        onClick={() => onDelete(task.id)}
                        disabled={pending}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
