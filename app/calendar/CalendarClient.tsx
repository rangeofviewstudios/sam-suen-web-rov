"use client";

import { useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import {
  URGENCY_META,
  URGENCY_ORDER,
  type Section,
  type Task,
  type TeamMember,
  type Urgency,
} from "./types";
import {
  addMember,
  addSection,
  deleteSection,
  deleteTask,
  moveTask,
  removeMember,
  toggleTask,
} from "./actions";
import BoardView, { type GroupBy } from "./BoardView";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import TaskDialog, { type TaskDefaults } from "./TaskDialog";
import styles from "./calendar.module.css";

type View = "board" | "calendar" | "list";

type OptAction =
  | { kind: "patch"; id: string; patch: Partial<Task> }
  | { kind: "remove"; id: string };

export default function CalendarClient({
  initialTasks,
  sections,
  members,
}: {
  initialTasks: Task[];
  sections: Section[];
  members: TeamMember[];
}) {
  const [view, setView] = useState<View>("board");
  const [groupBy, setGroupBy] = useState<GroupBy>("section");

  // Filters
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<Urgency | "all">("all");
  const [urgentOnly, setUrgentOnly] = useState(false);

  // UI
  const [dialog, setDialog] = useState<
    { task?: Task; defaults?: TaskDefaults } | null
  >(null);
  const [showManage, setShowManage] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, applyOptimistic] = useOptimistic(
    initialTasks,
    (state: Task[], action: OptAction) =>
      action.kind === "remove"
        ? state.filter((t) => t.id !== action.id)
        : state.map((t) =>
            t.id === action.id ? { ...t, ...action.patch } : t,
          ),
  );

  const sectionName = useMemo(() => {
    const m = new Map(sections.map((s) => [s.id, s.name]));
    return (id: string | null) => (id ? (m.get(id) ?? null) : null);
  }, [sections]);

  const memberName = useMemo(() => {
    const m = new Map(members.map((p) => [p.id, p.name]));
    return (id: string | null) => (id ? (m.get(id) ?? null) : null);
  }, [members]);

  const visibleTasks = useMemo(() => {
    return optimisticTasks.filter((t) => {
      if (urgentOnly && t.urgency !== "urgent") return false;
      if (filterUrgency !== "all" && t.urgency !== filterUrgency) return false;
      if (filterAssignee === "unassigned" && t.assignee_id) return false;
      if (
        filterAssignee !== "all" &&
        filterAssignee !== "unassigned" &&
        t.assignee_id !== filterAssignee
      )
        return false;
      return true;
    });
  }, [optimisticTasks, urgentOnly, filterUrgency, filterAssignee]);

  // ── Mutations ──
  function handleMove(id: string, group: GroupBy, value: string | null) {
    const patch: Partial<Task> =
      group === "section"
        ? { section_id: value }
        : group === "assignee"
          ? { assignee_id: value }
          : { urgency: (value ?? "low") as Urgency };
    startTransition(async () => {
      applyOptimistic({ kind: "patch", id, patch });
      await moveTask(id, group, value);
    });
  }

  function handleToggle(task: Task) {
    startTransition(async () => {
      applyOptimistic({
        kind: "patch",
        id: task.id,
        patch: { completed: !task.completed },
      });
      await toggleTask(task.id, !task.completed);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      applyOptimistic({ kind: "remove", id });
      await deleteTask(id);
    });
  }

  const showGroupBy = view === "board" || view === "list";

  return (
    <div className={styles.layout}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.segmented}>
          {(["board", "calendar", "list"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`${styles.segment} ${
                view === v ? styles.segmentActive : ""
              }`}
              onClick={() => setView(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {showGroupBy && (
          <div className={styles.toolGroup}>
            <span className={styles.toolLabel}>Group</span>
            <select
              className={styles.filterSelect}
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            >
              <option value="section">Section</option>
              <option value="assignee">Person</option>
              <option value="urgency">Urgency</option>
            </select>
          </div>
        )}

        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>Person</span>
          <select
            className={styles.filterSelect}
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <option value="all">Everyone</option>
            <option value="unassigned">Unassigned</option>
            {members.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>Urgency</span>
          <select
            className={styles.filterSelect}
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value as Urgency | "all")}
            disabled={urgentOnly}
          >
            <option value="all">Any</option>
            {URGENCY_ORDER.map((u) => (
              <option key={u} value={u}>
                {URGENCY_META[u].label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`${styles.urgentToggle} ${
            urgentOnly ? styles.urgentToggleActive : ""
          }`}
          onClick={() => setUrgentOnly((v) => !v)}
        >
          {urgentOnly ? "● Urgent only" : "Urgent only"}
        </button>

        <span className={styles.spacer} />

        <button
          type="button"
          className={styles.manageButton}
          onClick={() => setShowManage((v) => !v)}
        >
          {showManage ? "Close" : "Manage"}
        </button>
        <button
          type="button"
          className={styles.newButton}
          onClick={() => setDialog({ defaults: {} })}
        >
          + New task
        </button>
      </div>

      {/* ── Manage panel ── */}
      {showManage && (
        <div className={styles.managePanel}>
          <ManageColumn
            title="Sections"
            items={sections.map((s) => ({ id: s.id, name: s.name }))}
            onAdd={addSection}
            onRemove={(id) => startTransition(() => deleteSection(id))}
            addPlaceholder="New section…"
            pending={isPending}
          />
          <ManageColumn
            title="Team members"
            items={members.map((p) => ({ id: p.id, name: p.name }))}
            onAdd={addMember}
            onRemove={(id) => startTransition(() => removeMember(id))}
            addPlaceholder="New member…"
            pending={isPending}
          />
        </div>
      )}

      {/* ── Active view ── */}
      {visibleTasks.length === 0 && optimisticTasks.length > 0 ? (
        <p className={styles.empty}>No tasks match the current filters.</p>
      ) : optimisticTasks.length === 0 ? (
        <p className={styles.empty}>
          No tasks yet. Hit <strong>+ New task</strong>, or add one straight
          into a column on the board.
        </p>
      ) : view === "board" ? (
        <BoardView
          tasks={visibleTasks}
          sections={sections}
          members={members}
          groupBy={groupBy}
          sectionName={sectionName}
          memberName={memberName}
          onMove={handleMove}
          onEdit={(task) => setDialog({ task })}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ) : view === "list" ? (
        <ListView
          tasks={visibleTasks}
          sections={sections}
          members={members}
          groupBy={groupBy}
          sectionName={sectionName}
          memberName={memberName}
          onEdit={(task) => setDialog({ task })}
          onToggle={handleToggle}
          onDelete={handleDelete}
          pending={isPending}
        />
      ) : (
        <CalendarView
          tasks={visibleTasks}
          onSelect={(task) => setDialog({ task })}
        />
      )}

      {/* ── Create / edit modal ── */}
      {dialog && (
        <TaskDialog
          task={dialog.task}
          defaults={dialog.defaults}
          sections={sections}
          members={members}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

/* ── Manage column (sections / members) ── */
function ManageColumn({
  title,
  items,
  onAdd,
  onRemove,
  addPlaceholder,
  pending,
}: {
  title: string;
  items: { id: string; name: string }[];
  onAdd: (formData: FormData) => Promise<void>;
  onRemove: (id: string) => void;
  addPlaceholder: string;
  pending: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAdd(formData: FormData) {
    await onAdd(formData);
    formRef.current?.reset();
  }

  return (
    <div>
      <h3 className={styles.manageTitle}>{title}</h3>
      {items.length === 0 ? (
        <p className={styles.manageEmpty}>None yet.</p>
      ) : (
        <ul className={styles.manageList}>
          {items.map((it) => (
            <li key={it.id} className={styles.manageItem}>
              <span>{it.name}</span>
              <button
                type="button"
                className={styles.removeX}
                onClick={() => onRemove(it.id)}
                disabled={pending}
                aria-label={`Remove ${it.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <form ref={formRef} action={handleAdd} className={styles.manageAdd}>
        <input
          name="name"
          className={styles.input}
          required
          placeholder={addPlaceholder}
        />
        <button type="submit" className={styles.smallButton} disabled={pending}>
          Add
        </button>
      </form>
    </div>
  );
}
