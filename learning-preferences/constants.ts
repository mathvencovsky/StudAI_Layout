export const INTEREST_OPTIONS = [
  "web-development",
  "mobile-development",
  "data-science",
  "machine-learning",
  "cloud-computing",
  "devops",
  "cybersecurity",
  "databases",
  "ui-ux-design",
  "game-development",
  "blockchain",
  "embedded-systems",
] as const;

export const MINUTES_PRESETS = [10, 20, 30, 45, 60] as const;
export const MINUTES_MIN = 5;
export const MINUTES_MAX = 120;
export const MINUTES_STEP = 5;

export const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export const FORMAT_OPTIONS = [
  { value: "video", icon: "IconVideo" },
  { value: "reading", icon: "IconBook" },
  { value: "hands-on", icon: "IconCode" },
] as const;

export const CONTENT_LENGTH_OPTIONS = [
  { value: "bite_sized", label: "2–5 min" },
  { value: "short", label: "5–15 min" },
  { value: "medium", label: "15–30 min" },
  { value: "deep_dive", label: "30+ min" },
] as const;

export const TOTAL_STEPS = 5;
