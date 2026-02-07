Generate a technical spec for the feature described bellow following the structure in `docs/planner.md`. Save it as `SPEC.md` inside a new folder under `docs/specs/<feature-name>/`.

Feature: In the content details page, customers can see the content details and learn it. They can also open an AI Chat panel.

If the user is not part of a group called "Ai", you should show a message saying that there's a wait list to use that feature and a button to participate. If they press the button, it should store in the database that the user is interested and the time that they pressed the button.

If the user already pressed the button, it should show that they are already in the waiting list.
