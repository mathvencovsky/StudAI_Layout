Generate a technical spec for the feature described bellow following the structure in `docs/planner.md`. Save it as `SPEC.md` inside a new folder under `docs/specs/<feature-name>/`.

Feature: You are a senior product designer + frontend engineer. Design and implement a “Learning Preferences” setup experience. The goal is to avoid a boring long form by using a guided, step-by-step onboarding flow with animations and micro-interactions.

PRODUCT GOAL
Create a new page where customers define learning preferences so an AI can recommend tailored learning paths. Explain clearly that the more info they add, the better recommendations will be. All fields are optional EXCEPT “Areas of interest” (at least 1 must be selected).

CORE UX PRINCIPLES

- Do NOT present a traditional stacked form. Present ONE question at a time.
- The user progresses through steps using a “Next” flow (wizard-like).
- Steps should slide/fade smoothly into the next step (use Framer Motion if available).
- Always show “Back” and “Skip” (Skip only for optional steps).
- Show progress: “Step X of 5” and a progress bar.
- Make the experience feel like “building a learning profile,” not filling a form.
- Keep copy friendly, short, and reassuring (“You can change this later.”).
- Reduce friction: quick pick UI (chips, day pills, cards, slider) instead of text inputs.

REQUIRED FIELD

1. Areas of Interest (REQUIRED)

- A fixed, predefined list in code of broad interest areas.
- Display as multi-select chips/pills (ToggleGroup multiple).
- Must require at least 1 selected before allowing “Next”.
- Show small helper text: “Pick 1–3 to start. You can update later.”
- Display selected count.

OPTIONAL FIELDS (each step can be skipped) 2) Daily time commitment (minutes)

- Options in minutes. Use quick buttons (e.g., 10, 20, 30, 45, 60) plus a slider (5–120, step 5).
- Show current selection as “X minutes/day” or “Not set”.
- Include a “Clear” option to unset.

3. Days of the week available

- User can select any days (Mon–Sun).
- Use day pills/toggles (M T W T F S S).
- Show selected count.

4. Preferred learning formats (multi-select)

- Multi-select cards with icons + short descriptions:
  - Video
  - Reading
  - Hands-on exercises
- Clicking a card toggles it on/off (with checkbox indicator).

5. Preferred content length

- Single select options shown as radio-style cards:
  - Bite-sized (2–5 min)
  - Short (5–15 min)
  - Medium (15–30 min)
  - Deep dive (30+ min)
- Allow clearing (optional): clicking selected option again can unset.

PAGE STRUCTURE

- Header: “Learning preferences”
- Subtext explaining why: “These preferences help AI recommend learning paths tailored to you. The more you add, the better the recommendations.”
- Badges: “1 required” and “4 optional”
- Progress indicator: “Step 1 of 5” plus progress bar
- Main content: a centered Card containing the current step question and interactive controls
- Bottom sticky action bar inside the Card:
  - Left: Back (disabled on step 1)
  - Middle: small hint (“Required” or “Optional”)
  - Right: Next (or Save on final step) and Skip (only when optional)
- Final confirmation screen after step 5:
  - Message: “Done — we’ll tailor your learning path.”
  - Primary CTA: “Save preferences”
  - Secondary CTA: “Edit” (go back)

TECHNICAL REQUIREMENTS

- Use Shadcn UI components wherever possible: Card, Button, ToggleGroup, ToggleGroupItem, Slider, Checkbox, Progress, Badge, Separator (as needed).
- Use react-hook-form + zod for validation:
  - interests: array(string) min 1 (required)
  - minutesPerDay: optional number
  - days: optional array(string)
  - formats: optional array(string)
  - contentLength: optional enum
- Keep predefined lists in constants.
- State management:
  - Maintain form state across steps.
  - Allow navigation back/forward without losing selections.
  - Allow skipping optional steps without setting values.
- Animations:
  - Animate step transitions (slide + fade).
  - Respect reduced motion preferences if possible.
- Accessibility:
  - All controls keyboard accessible.
  - Clear aria-labels for toggles and day pills.
  - Error message shown only for interests when user tries to proceed without selecting.
- Submission:
  - On save, output a single object of preferences.
  - Provide a placeholder function for API call (e.g., server action or fetch).
  - Add toasts or inline feedback on successful save.

COPY / MICROCOPY (use similar tone)

- Intro: “Fill this in so AI can recommend learning paths tailored to you. The more info you add, the better it will be.”
- Interests helper: “Pick 1–3 to start. You can change later.”
- Optional hint: “Optional — skip if you’re not sure.”
- Minutes tip: “Even 10 minutes helps — consistency beats intensity.”

OUTPUT EXPECTATION
Produce:

1. A concise UX description of the step-by-step experience (non-technical).
2. The technical implementation plan (data model, components, validation).
3. A complete React page/component example that matches the UX, using Shadcn + react-hook-form + zod and animated step transitions.
