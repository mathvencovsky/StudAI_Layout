import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginRouter from "@tanstack/eslint-plugin-router";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["src/**/*.{ts,tsx}"],
        ignores: ["vite.config.ts", "src/components/ui/*", "src/routeTree.gen.ts"],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.strict,
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
            ...pluginRouter.configs["flat/recommended"],
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: "tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/no-empty-object-type": "off",
            "no-empty-pattern": "off",
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    },
]);
