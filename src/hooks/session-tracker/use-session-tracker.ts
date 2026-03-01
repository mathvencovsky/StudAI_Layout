import { useEffect, useRef } from "react";
import { useCreateStudySession } from "@/hooks/study-session/use-create-session";
import { useUpdateStudySession } from "@/hooks/study-session/use-update-session";

const STORAGE_KEY = "stud-ai:active-session";
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;
const ORPHAN_THRESHOLD_SECONDS = 10 * 60;

interface TrackedSession {
  sessionId: string;
  startedAt: number;
  lastActiveAt: number;
  accumulatedMinutes: number;
}

/**
 * Global session tracker hook that manages active time tracking.
 * Uses navigator.locks to ensure only one tab tracks at a time.
 */
export function useSessionTracker() {
  const { mutateAsync: createSession } = useCreateStudySession();
  const { mutate: updateSession } = useUpdateStudySession();
  const sessionRef = useRef<TrackedSession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHeartbeatRef = useRef<number>(0);
  const lockResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const sync = () => {
      if (!sessionRef.current) return;
      const now = Math.floor(Date.now() / 1000);
      const elapsed = Math.floor((now - lastHeartbeatRef.current) / 60);
      sessionRef.current.accumulatedMinutes += elapsed;
      sessionRef.current.lastActiveAt = now;
      lastHeartbeatRef.current = now;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionRef.current));
      updateSession({
        id: sessionRef.current.sessionId,
        lastActiveAt: now,
        durationMinutes: sessionRef.current.accumulatedMinutes,
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        sync();
      } else {
        lastHeartbeatRef.current = Math.floor(Date.now() / 1000);
        intervalRef.current = setInterval(sync, HEARTBEAT_INTERVAL_MS);
      }
    };

    const startTracking = async (): Promise<() => void> => {
      const now = Math.floor(Date.now() / 1000);
      let stored: TrackedSession | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) stored = JSON.parse(raw) as TrackedSession;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }

      if (stored) {
        const age = now - stored.lastActiveAt;
        if (age < ORPHAN_THRESHOLD_SECONDS) {
          sessionRef.current = stored;
          lastHeartbeatRef.current = now;
        } else {
          updateSession({
            id: stored.sessionId,
            endedAt: stored.lastActiveAt,
            durationMinutes: stored.accumulatedMinutes,
          });
          localStorage.removeItem(STORAGE_KEY);
          stored = null;
        }
      }

      if (!sessionRef.current) {
        const session = await createSession({ startedAt: now, lastActiveAt: now });
        sessionRef.current = {
          sessionId: session.id,
          startedAt: now,
          lastActiveAt: now,
          accumulatedMinutes: 0,
        };
        lastHeartbeatRef.current = now;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionRef.current));
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);
      if (!document.hidden) {
        intervalRef.current = setInterval(sync, HEARTBEAT_INTERVAL_MS);
      }

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (intervalRef.current) clearInterval(intervalRef.current);
        sync();
      };
    };

    if (!navigator.locks) {
      startTracking().then((fn) => {
        if (cancelled) {
          fn();
        } else {
          cleanup = fn;
        }
      });
    } else {
      navigator.locks.request(
        "stud-ai:session-lock",
        { ifAvailable: true },
        async (lock) => {
          if (!lock) return;
          const fn = await startTracking();
          if (cancelled) {
            fn();
            return;
          }
          cleanup = fn;
          return new Promise<void>((resolve) => {
            lockResolveRef.current = resolve;
          });
        },
      );
    }

    return () => {
      cancelled = true;
      cleanup?.();
      lockResolveRef.current?.();
    };
  }, []);
}
