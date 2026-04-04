import { z } from "zod";
import { type Category } from "@/model/category";

const CategoryValues = [
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
  "vestibular_enem",
  "concursos_publicos",
  "certifications",
  "languages",
  "math_logic",
  "productivity_tools",
  "career_market",
  "business_entrepreneurship",
  "marketing_sales",
  "design_creative",
  "law",
] as const satisfies Category[];

export const discoveryFormSchema = z.object({
  objectives: z.array(z.string()).min(1),
  context: z.enum([
    "beginner",
    "career_change",
    "upskilling",
    "job_prep",
    "academic",
    "personal_project",
  ]),
  interests: z.array(z.enum(CategoryValues)).min(1),
  learningStyles: z.array(z.string()).min(1).max(3),
  preferencePace: z.number().min(1).max(10),
  preferenceDepth: z.number().min(1).max(10),
  preferenceStructure: z.number().min(1).max(10),
  preferenceChallenge: z.number().min(1).max(10),
  hoursPerWeek: z.number().min(1).max(40),
  totalWeeks: z.number().min(1).max(52),
  budget: z.enum(["free", "paid"]),
  urgency: z.number().min(1).max(5),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  minutesPerDay: z.number().min(5).max(120).optional(),
  days: z.array(z.string()).optional(),
  formats: z.array(z.string()).optional(),
  contentLength: z
    .enum(["bite_sized", "short", "medium", "deep_dive"])
    .optional(),
});

export type DiscoveryFormValues = z.infer<typeof discoveryFormSchema>;
