export const OBJECTIVE_OPTIONS = [
  { id: "employment", icon: "💼", translationKey: "discovery-objective-employment", descriptionKey: "discovery-objective-employment-desc" },
  { id: "career_change", icon: "🔄", translationKey: "discovery-objective-career-change", descriptionKey: "discovery-objective-career-change-desc" },
  { id: "skill_improvement", icon: "📊", translationKey: "discovery-objective-skill-improvement", descriptionKey: "discovery-objective-skill-improvement-desc" },
  { id: "personal_project", icon: "🚀", translationKey: "discovery-objective-personal-project", descriptionKey: "discovery-objective-personal-project-desc" },
  { id: "academic_growth", icon: "📚", translationKey: "discovery-objective-academic-growth", descriptionKey: "discovery-objective-academic-growth-desc" },
] as const;

export const CONTEXT_SCENARIOS = [
  { id: "beginner", icon: "🌱", translationKey: "discovery-context-beginner", descriptionKey: "discovery-context-beginner-desc" },
  { id: "career_change", icon: "🔄", translationKey: "discovery-context-career-change", descriptionKey: "discovery-context-career-change-desc" },
  { id: "upskilling", icon: "📈", translationKey: "discovery-context-upskilling", descriptionKey: "discovery-context-upskilling-desc" },
  { id: "job_prep", icon: "🎯", translationKey: "discovery-context-job-prep", descriptionKey: "discovery-context-job-prep-desc" },
  { id: "academic", icon: "🎓", translationKey: "discovery-context-academic", descriptionKey: "discovery-context-academic-desc" },
  { id: "personal_project", icon: "💡", translationKey: "discovery-context-personal-project", descriptionKey: "discovery-context-personal-project-desc" },
] as const;

export const LEARNING_STYLE_OPTIONS = [
  { id: "visual", icon: "👁️", translationKey: "discovery-style-visual", descriptionKey: "discovery-style-visual-desc" },
  { id: "hands_on", icon: "🛠️", translationKey: "discovery-style-hands-on", descriptionKey: "discovery-style-hands-on-desc" },
  { id: "theoretical", icon: "📖", translationKey: "discovery-style-theoretical", descriptionKey: "discovery-style-theoretical-desc" },
  { id: "interactive", icon: "💬", translationKey: "discovery-style-interactive", descriptionKey: "discovery-style-interactive-desc" },
  { id: "self_paced", icon: "⏰", translationKey: "discovery-style-self-paced", descriptionKey: "discovery-style-self-paced-desc" },
  { id: "structured", icon: "📋", translationKey: "discovery-style-structured", descriptionKey: "discovery-style-structured-desc" },
] as const;

export const GOAL_OPTIONS = [
  {
    id: "job_prep",
    context: "job_prep" as const,
    objectives: ["employment", "academic_growth"],
    icon: "🏛️",
    titleKey: "goal-concurso-cert",
    descKey: "goal-concurso-cert-desc",
  },
  {
    id: "career_change",
    context: "career_change" as const,
    objectives: ["career_change"],
    icon: "🔄",
    titleKey: "goal-career-change",
    descKey: "goal-career-change-desc",
  },
  {
    id: "upskilling",
    context: "upskilling" as const,
    objectives: ["skill_improvement", "employment"],
    icon: "📈",
    titleKey: "goal-upskilling",
    descKey: "goal-upskilling-desc",
  },
  {
    id: "academic",
    context: "academic" as const,
    objectives: ["academic_growth"],
    icon: "🎓",
    titleKey: "goal-academic",
    descKey: "goal-academic-desc",
  },
  {
    id: "beginner",
    context: "beginner" as const,
    objectives: ["skill_improvement", "personal_project"],
    icon: "🌱",
    titleKey: "goal-beginner",
    descKey: "goal-beginner-desc",
  },
  {
    id: "personal_project",
    context: "personal_project" as const,
    objectives: ["personal_project"],
    icon: "🚀",
    titleKey: "goal-personal-project",
    descKey: "goal-personal-project-desc",
  },
] as const;
