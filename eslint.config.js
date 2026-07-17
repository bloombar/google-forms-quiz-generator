// ESLint v9 flat config. Lints the TypeScript source and tests with the
// recommended JS + typescript-eslint rule sets; build and coverage output
// are ignored.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "coverage/", "node_modules/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
