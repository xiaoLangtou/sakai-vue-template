# AGENTS Guidelines for This Repository

This repository contains a Vue.js application built with Rsbuild located in the root of this repository. When working on the project interactively with an agent (e.g. Claude Code CLI) please follow the guidelines below so that the development experience – in particular Hot Module Replacement (HMR) – continues to work smoothly.

## 1. Use the Correct Package Manager

**Important**: Always use the package manager that matches the existing lockfile in the repository:

- If `package-lock.json` exists → Use **npm** commands (`npm run dev:rsbuild`, `npm install`, etc.)
- If `pnpm-lock.yaml` exists → Use **pnpm** commands (`pnpm dev:rsbuild`, `pnpm install`, etc.)
- If `yarn.lock` exists → Use **yarn** commands (`yarn dev:rsbuild`, `yarn install`, etc.)

**Do not mix package managers** - this can cause dependency conflicts and inconsistent lockfiles.

## 2. Use the Development Server, **not** Production Build

- **Always use the development command** while iterating on the application:
    - `npm run dev:rsbuild` (if using npm)
    - `pnpm dev:rsbuild` (if using pnpm)
    - `yarn dev:rsbuild` (if using yarn)
- **Do _not_ run production build commands** inside the agent session:
    - `npm run build:pro` / `pnpm build:pro` / `yarn build:pro`
    - `npm run build:pro:rsdoctor` / `pnpm build:pro:rsdoctor` / `yarn build:pro:rsdoctor`
- Running production build commands switches the build output to production assets which disables hot reload and can leave the development server in an inconsistent state.

## 3. Keep Dependencies in Sync

If you add or update dependencies remember to:

1. **Use the correct package manager** (see section 1 above).
2. The lockfile will be automatically updated when you install/update packages.
3. Re-start the development server so that Rsbuild picks up the changes.
4. If adding PrimeVue components, ensure they're properly configured with the auto-import resolver.

## 4. Coding Conventions

- **Prefer TypeScript (`.vue` with `<script setup lang="ts">`, `.ts`)** for new components and utilities.
- **Use Composition API with `<script setup>`** for new Vue components.
- **Co-locate component-specific styles** in the same folder as the component when practical.
- **Follow the existing PrimeVue + Tailwind CSS pattern** for UI components.
- **Use Vue 3 patterns** - this project uses Vue 3.4+ with modern features.

## 5. Code Quality Tools

This project has strict linting and formatting rules:

- **Run linting** with the appropriate package manager (`npm run lint` / `pnpm lint` / `yarn lint`).
- **Run formatting** with the appropriate package manager (`npm run format` / `pnpm format` / `yarn format`).
- **Pre-commit hooks are enabled** via Husky - commits will be automatically linted and formatted.

## 6. Useful Commands Recap

Replace `npm` with `pnpm` or `yarn` based on the lockfile present in the repository:

| Command                      | Purpose                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| `npm run dev:rsbuild`        | Start the Rsbuild dev server with HMR.                                  |
| `npm run lint`               | Run comprehensive linting (oxlint + ESLint).                            |
| `npm run lint:eslint`        | Run ESLint only with auto-fix.                                          |
| `npm run format`             | Format all files with Prettier.                                         |
| `npm run prettier`           | Alternative Prettier command.                                           |
| `npm install <package>`      | Add a new dependency.                                                   |
| `npm run build:pro`          | **Production build – _do not run during agent sessions_**               |
| `npm run build:pro:rsdoctor` | **Production build with analysis – _do not run during agent sessions_** |

## 7. Project-Specific Notes

- **Framework**: Vue 3.4+ with Composition API
- **Build Tool**: Rsbuild (faster alternative to Vite/Webpack)
- **UI Library**: PrimeVue 4.3+ with PrimeUI themes
- **Styling**: Tailwind CSS with PrimeUI integration
- **State Management**: Pinia with persistence plugin
- **Routing**: Vue Router 4+
- **Data Fetching**: TanStack Query for Vue
- **Validation**: Zod for schema validation
- **Internationalization**: Vue I18n

---

Following these practices ensures that the agent-assisted development workflow stays fast and dependable. **Always check which lockfile exists first**, then use the corresponding package manager consistently throughout the session.
