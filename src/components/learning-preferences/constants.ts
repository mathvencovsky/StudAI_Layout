import { type Category } from "@/model/category";

export const INTEREST_OPTIONS: Category[] = [
  "web_development",
  "mobile_development",
  "data_science",
  "machine_learning",
  "cloud_computing",
  "devops",
  "cybersecurity",
  "databases",
  "ui_ux_design",
  "game_development",
  "blockchain",
  "embedded_systems",
];

export const INTEREST_TRANSLATION_KEYS = {
  blockchain: "learning-preferences-interest-blockchain",
  cloud_computing: "learning-preferences-interest-cloud-computing",
  cybersecurity: "learning-preferences-interest-cybersecurity",
  data_science: "learning-preferences-interest-data-science",
  databases: "learning-preferences-interest-databases",
  devops: "learning-preferences-interest-devops",
  embedded_systems: "learning-preferences-interest-embedded-systems",
  game_development: "learning-preferences-interest-game-development",
  machine_learning: "learning-preferences-interest-machine-learning",
  mobile_development: "learning-preferences-interest-mobile-development",
  ui_ux_design: "learning-preferences-interest-ui-ux-design",
  web_development: "learning-preferences-interest-web-development",
} as const satisfies Record<Category, string>;

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
