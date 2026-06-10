export type Urgency = "low" | "72_hours" | "urgent";

export type Section = {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  created_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string; // ISO timestamp
  end_time: string | null; // ISO timestamp
  completed: boolean;
  urgency: Urgency;
  section_id: string | null;
  assignee_id: string | null;
  created_at: string;
};

/** Display label, badge color, and severity rank for each urgency level. */
export const URGENCY_META: Record<
  Urgency,
  { label: string; color: string; rank: number }
> = {
  low: { label: "Low", color: "#5b6472", rank: 0 },
  "72_hours": { label: "72 Hours", color: "#b07410", rank: 1 },
  urgent: { label: "Urgent", color: "#b3322a", rank: 2 },
};

export const URGENCY_ORDER: Urgency[] = ["low", "72_hours", "urgent"];
