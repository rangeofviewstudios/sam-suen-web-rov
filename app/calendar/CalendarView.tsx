"use client";

import { useMemo } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type Event as RbcEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

import { URGENCY_META, type Task } from "./types";
import styles from "./calendar.module.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

type TaskEvent = Omit<RbcEvent, "resource"> & { resource: Task };

export default function CalendarView({
  tasks,
  onSelect,
}: {
  tasks: Task[];
  onSelect: (task: Task) => void;
}) {
  const events: TaskEvent[] = useMemo(
    () =>
      tasks.map((t) => ({
        title: t.title,
        start: new Date(t.start_time),
        end: new Date(t.end_time ?? t.start_time),
        allDay: false,
        resource: t,
      })),
    [tasks],
  );

  return (
    <div className={styles.calendarWrap}>
      <Calendar<TaskEvent>
        localizer={localizer}
        events={events}
        defaultView="month"
        views={["month", "week", "day", "agenda"]}
        popup
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event: TaskEvent) => onSelect(event.resource)}
        eventPropGetter={(event: TaskEvent) => {
          const t = event.resource;
          if (t.completed) {
            return {
              style: {
                backgroundColor: "#2e2e2e",
                borderColor: "#3a3a3a",
                textDecoration: "line-through",
                opacity: 0.6,
              },
            };
          }
          const meta = URGENCY_META[t.urgency] ?? URGENCY_META.low;
          return {
            style: {
              backgroundColor: meta.color,
              borderColor: "rgba(0,0,0,0.25)",
            },
          };
        }}
        style={{ height: "100%" }}
      />
    </div>
  );
}
