Generate a technical spec for the feature described bellow following the structure in `docs/planner.md`. Save it as `SPEC.md` inside a new folder under `docs/specs/<feature-name>/`.

Feature: The application has modules that has a series of contents, Create the concept of a Track, which is a group of modules.
The way a track store the modules is not in a list, but in a tree. You have an initial module that you need to learn and from it you will be able to branch out to different modules.

The track doesn't need to store the entire data of a module, just it's references and the UI can load the references and show the correct module.

Example of a real Track: you want to be a frontend engineer. A Track for FrontEnd Engineer will have modules for Programming Logic, HTML, CSS, Javascript, etc. Then each module will have contents (like videos) to learn about the module. You start from Programming Logic module and then you can go to HTML or Javascript, After HTML, you go to CSS.
