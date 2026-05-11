/** Rescue events that fire periodically during gameplay. */

export type EventKind = "tornado" | "pileup" | "blackout";
export type EventState = "idle" | "active" | "succeeded" | "failed";

export type RescueEvent = {
  state: EventState;
  kind: EventKind | null;
  startedAt: number;
  duration: number;
  carsRescued: number;
  carsNeeded: number;
  collisions: number;
};

export function makeEvent(): RescueEvent {
  return {
    state: "idle",
    kind: null,
    startedAt: 0,
    duration: 0,
    carsRescued: 0,
    carsNeeded: 0,
    collisions: 0,
  };
}

export function startEvent(ev: RescueEvent, kind: EventKind, now: number): void {
  ev.kind = kind;
  ev.state = "active";
  ev.startedAt = now;
  ev.carsRescued = 0;
  ev.collisions = 0;
  if (kind === "tornado") {
    ev.duration = 16;
    ev.carsNeeded = 3;
  } else if (kind === "pileup") {
    ev.duration = 18;
    ev.carsNeeded = 4;
  } else {
    ev.duration = 20;
    ev.carsNeeded = 3;
  }
}

export function tickEvent(ev: RescueEvent, now: number): EventState {
  if (ev.state !== "active") return ev.state;
  const elapsed = (now - ev.startedAt) / 1000;
  if (ev.kind === "pileup" && ev.collisions >= 2) {
    ev.state = "failed";
    return ev.state;
  }
  if (ev.carsRescued >= ev.carsNeeded) {
    ev.state = "succeeded";
    return ev.state;
  }
  if (elapsed >= ev.duration) {
    ev.state = ev.carsRescued >= Math.ceil(ev.carsNeeded * 0.6) ? "succeeded" : "failed";
    return ev.state;
  }
  return ev.state;
}

export function resetEvent(ev: RescueEvent): void {
  ev.state = "idle";
  ev.kind = null;
}

/** Pick random event kind (uniform) */
export function pickEventKind(): EventKind {
  const r = Math.random();
  if (r < 0.34) return "tornado";
  if (r < 0.67) return "pileup";
  return "blackout";
}
