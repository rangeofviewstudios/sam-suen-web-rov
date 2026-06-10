"use client";

import { useRef, useState } from "react";
import {
  URGENCY_META,
  type Section,
  type Task,
  type TeamMember,
} from "./types";
import { createTask } from "./actions";
import { Avatar, nowLocal, shortDate } from "./ui";
import styles from "./calendar.module.css";

export type GroupBy = "section" | "assignee" | "urgency";

type Column = {
  key: string;
  label: string;
  value: string | null;
  accent?: string;
};

export default function BoardView({
  tasks,
  sections,
  members,
  groupBy,
  sectionName,
  memberName,
  onMove,
  onEdit,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  sections: Section[];
  members: TeamMember[];
  groupBy: GroupBy;
  sectionName: (id: string | null) => string | null;
  memberName: (id: string | null) => string | null;
  onMove: (id: string, group: GroupBy, value: string | null) => void;
  onEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const columns: Column[] =
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

  function inColumn(t: Task, col: Column): boolean {
    if (groupBy === "section") return (t.section_id ?? null) === col.value;
    if (groupBy === "assignee") return (t.assignee_id ?? null) === col.value;
    return t.urgency === col.value;
  }

  function sortTasks(a: Task, b: Task): number {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const r =
      (URGENCY_META[b.urgency]?.rank ?? 0) - (URGENCY_META[a.urgency]?.rank ?? 0);
    if (r) return r;
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  }

  return (
    <div className={styles.board}>
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => inColumn(t, col)).sort(sortTasks);
        return (
          <div
            key={col.key}
            className={`${styles.column} ${
              dragOver === col.key ? styles.columnDragOver : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOver !== col.key) setDragOver(col.key);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragOver((d) => (d === col.key ? null : d));
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              setDragOver(null);
              if (id) onMove(id, groupBy, col.value);
            }}
          >
            <div className={styles.columnHead}>
              <span
                className={styles.columnName}
                style={col.accent ? { color: col.accent } : undefined}
              >
                {col.label}
              </span>
              <span className={styles.columnCount}>{colTasks.length}</span>
            </div>

            <div className={styles.columnBody}>
              {colTasks.map((task) => {
                const meta = URGENCY_META[task.urgency] ?? URGENCY_META.low;
                const sName = sectionName(task.section_id);
                return (
                  <div
                    key={task.id}
                    className={`${styles.card} ${
                      task.completed ? styles.cardDone : ""
                    }`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", task.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => onEdit(task)}
                  >
                    <span
                      className={styles.cardStripe}
                      style={{ background: meta.color }}
                    />
                    <div className={styles.cardMain}>
                      <div className={styles.cardTop}>
                        <button
                          type="button"
                          className={styles.cardCheck}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggle(task);
                          }}
                          aria-label="Toggle complete"
                        >
                          {task.completed ? "✓" : ""}
                        </button>
                        <span className={styles.cardTitle}>{task.title}</span>
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.cardTags}>
                          {groupBy !== "urgency" && (
                            <span
                              className={styles.urgencyDot}
                              style={{ background: meta.color }}
                              title={meta.label}
                            />
                          )}
                          <span className={styles.cardDate}>
                            {shortDate(task.start_time)}
                          </span>
                          {groupBy !== "section" && sName && (
                            <span className={styles.tag}>{sName}</span>
                          )}
                        </div>
                        <div className={styles.cardRight}>
                          {groupBy !== "assignee" && (
                            <Avatar name={memberName(task.assignee_id)} />
                          )}
                          <button
                            type="button"
                            className={styles.cardDelete}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(task.id);
                            }}
                            aria-label="Delete task"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <QuickAdd group={groupBy} value={col.value} />
          </div>
        );
      })}
    </div>
  );
}

function QuickAdd({
  group,
  value,
}: {
  group: GroupBy;
  value: string | null;
}) {
  const ref = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    formData.set("start", nowLocal());
    if (group === "section") formData.set("section_id", value ?? "");
    if (group === "assignee") formData.set("assignee_id", value ?? "");
    if (group === "urgency") formData.set("urgency", value ?? "low");
    await createTask(formData);
    ref.current?.reset();
  }

  return (
    <form ref={ref} action={action} className={styles.quickAdd}>
      <input
        name="title"
        className={styles.quickInput}
        placeholder="+ Add task"
        autoComplete="off"
        aria-label="Quick add task"
      />
    </form>
  );
}
