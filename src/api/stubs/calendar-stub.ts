import { createStub } from "./base-stub";

export interface CalendarEvent {
  id: string;
  type: "session" | "goal" | "review";
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  status: "scheduled" | "completed" | "cancelled";
}

export async function getUpcomingEventsStub(
  _days: number = 7,
): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = [
    {
      id: "1",
      type: "session",
      title: "Sessão de Estudo - React",
      description: "Estudar React Hooks avançados",
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(),
      status: "scheduled",
    },
    {
      id: "2",
      type: "goal",
      title: "Meta Semanal",
      description: "Completar 5 horas de estudo",
      startTime: new Date(Date.now() + 172800000).toISOString(),
      status: "scheduled",
    },
    {
      id: "3",
      type: "review",
      title: "Revisão - TypeScript",
      description: "Revisar conceitos de tipos genéricos",
      startTime: new Date(Date.now() + 259200000).toISOString(),
      endTime: new Date(Date.now() + 262800000).toISOString(),
      status: "scheduled",
    },
  ];

  return createStub(events);
}

export async function createCalendarEventStub(
  event: Omit<CalendarEvent, "id" | "status">,
): Promise<CalendarEvent> {
  return createStub({
    ...event,
    id: Date.now().toString(),
    status: "scheduled" as const,
  });
}
