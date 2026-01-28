/**
 * ESLint configuration for scripts directory.
 *
 * Uses flat config format (ESLint 9+).
 */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow numbers and booleans in template literals
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: true },
      ],
    },
  },
  {
    files: ["scripts/**/*.ts"],
  },
  {
    ignores: ["node_modules", "external", "ts", "docs", "**/*.js"],
  }
);
