# DevPulse File Purpose Guide

This document explains the main purpose served by the key files in this project so the codebase is easier to navigate by responsibility.

## 1. App entry and overall shell

- `app/layout.tsx` — Root application layout; sets global metadata, auth session availability, and the top-level HTML structure.
- `app/page.tsx` — Landing page for the app; checks whether the user is already signed in and redirects or shows marketing/home content.
- `app/globals.css` — Global styling layer for the application; includes design tokens, layout styling, and shared visual rules.

## 2. Authentication and user session

- `src/auth.ts` — Main NextAuth setup. Manages GitHub OAuth, JWT/session creation, user sync into the database, and access-token handling.
- `src/services/session.service.ts` — Reads the current authenticated user from the session and exposes helpers such as `getCurrentUser()` and `requireCurrentUser()`.
- `app/login/page.tsx` — Login flow entry page; guides user sign-in using GitHub authentication.
- `app/api/auth/[...nextauth]/route.ts` — NextAuth route handler for sign-in, sign-out, session, and callback endpoints.
- `app/api/auth/logout/route.ts` — Logs the user out and clears the active session-related state.

## 3. Dashboard and user-facing pages

- `app/dashboard/page.tsx` — Dashboard page entry; checks session and loads the authenticated dashboard context.
- `app/dashboard/dashboard-content.tsx` — Interactive client-side dashboard UI that shows stats, sync controls, and status information.
- `app/github/profile/page.tsx` — GitHub profile page entry; protects the page and loads the GitHub profile data view.
- `app/github/profile/github-profile-client.tsx` — Client-side UI for GitHub profile sync, repository sync, and status updates.
- `app/repos/page.tsx` — Repositories page entry; protects access and renders repository collection view.
- `app/repos/repos-client.tsx` — Client component used to fetch and render repo data on the repositories page.
- `app/analytics/page.tsx` — Analytics page entry; loads data for summary metrics and charts.
- `app/analytics/analytics-client.tsx` — Client-side analytics dashboard that fetches and renders charts and summary data.
- `app/repositories/[repositoryId]/page.tsx` — Individual repository detail page entry.
- `app/repositories/[repositoryId]/commits-list.tsx` — Client component that lists commits for one repository.

## 4. API routes for GitHub and data access

### GitHub integration APIs

- `app/api/github/profile/route.ts` — Syncs or fetches GitHub profile information for the current user.
- `app/api/github/repos/route.ts` — Fetches repos from the DB and triggers repository synchronization with GitHub.
- `app/api/github/repos/schedule/route.ts` — Queues a background sync job for repositories.
- `app/api/github/repos/sync-status/[jobId]/route.ts` — Checks the status of a scheduled GitHub sync job.

### Dashboard APIs

- `app/api/dashboard/stats/route.ts` — Returns summary stats for the dashboard.
- `app/api/dashboard/repos/route.ts` — Returns repository data for the dashboard.
- `app/api/dashboard/activity/route.ts` — Returns recent user activity data for dashboard widgets.

### Analytics APIs

- `app/api/analytics/summary/route.ts` — Returns overall productivity and summary analytics.
- `app/api/analytics/commits/route.ts` — Returns commit analytics.
- `app/api/analytics/commits/daily/route.ts` — Returns daily commit trend data.
- `app/api/analytics/commits/weekly/route.ts` — Returns weekly commit trend data.
- `app/api/analytics/commits/monthly/route.ts` — Returns monthly commit trend data.
- `app/api/analytics/languages/route.ts` — Returns language usage analytics.
- `app/api/analytics/repos/route.ts` — Returns repository-related analytics.
- `app/api/analytics/repository-distribution/route.ts` — Returns repo distribution data for charts.
- `app/api/analytics/top-repositories/route.ts` — Returns top repositories by activity or metric.

### Repository detail APIs

- `app/api/repositories/[repositoryId]/route.ts` — Returns detail information for a single repository.
- `app/api/repositories/[repositoryId]/commits/route.ts` — Returns commit history for a specific repository.
- `app/api/repositories/[repositoryId]/languages/route.ts` — Returns language breakdown for a repository.

### Sync and system APIs

- `app/api/sync/events/route.ts` — Exposes sync event stream/status to the frontend.
- `app/api/test-db/route.ts` — Test endpoint for verifying database connectivity or schema behavior.

## 5. Service layer: business logic

- `src/services/github.service.ts` — Performs direct GitHub API calls through Octokit to fetch user profile, repos, commits, and languages.
- `src/services/github-sync.service.ts` — Core synchronization service that merges GitHub data into the database using Prisma upserts.
- `src/services/sync-queue.service.ts` — Manages queued/background sync jobs for GitHub repository synchronization.
- `src/services/cache.service.ts` — Caching layer used to reduce repeat API calls and improve app performance.
- `src/services/realtime.service.ts` — Sends realtime events to the client during sync or activity updates.
- `src/services/activity.service.ts` — Records user activity events in the DB for analytics and audit tracking.
- `src/services/analytics.service.ts` — Build analytics data from DB records such as commits, repos, languages, and engagement patterns.
- `src/services/dashboard.service.ts` — Retrieves dashboard-specific summaries and repository activity for the user.
- `src/services/repository.service.ts` — Fetches repository records and related information for route-level access checks.
- `src/services/commit.service.ts` — Fetches recent commit data by repository.
- `src/services/language.service.ts` — Retrieves and organizes language usage data for repositories.
- `src/services/user.service.ts` — User-related DB queries and helpers.
- `src/services/session.service.ts` — Already described above as the user-session access layer.

## 6. Database and Prisma

- `prisma/schema.prisma` — Defines the database schema, models, relationships, and unique constraints for the app.
- `prisma/migrations/20260615171348_init/migration.sql` — Initial database schema migration.
- `prisma/migrations/20260729120000_align_commit_uniqueness/migration.sql` — Fixes and aligns unique constraints used to avoid duplicate repo records during re-sync.
- `src/server/prisma/client.ts` — Prisma client singleton used across services and API routes.

## 7. UI components and reusable building blocks

- `components/navigation.tsx` — Top navigation and app-level navigation controls.
- `components/ui/button.tsx` — Reusable button component styled for the project.
- `components/ui/card.tsx` — Reusable card UI for content panels and dashboard blocks.
- `components/ui/dialog.tsx` — Reusable modal/dialog component.
- `components/ui/input.tsx` — Shared input field component.

## 8. Project configuration and tooling

- `package.json` — Project scripts, dependencies, and app metadata.
- `next.config.ts` — Next.js build/runtime configuration.
- `tsconfig.json` — TypeScript compiler configuration.
- `eslint.config.mjs` — Linting configuration.
- `postcss.config.mjs` — PostCSS configuration for CSS processing.
- `components.json` — ShadCN/UI component configuration and aliases.
- `docker-compose.yml` — Local environment orchestration for services (likely Postgres or supporting containers).
- `prisma.config.ts` — Prisma configuration used by the project.
- `README.md` — General project overview and setup instructions.
- `SETUP_GUIDE.md` — Step-by-step local setup instructions.
- `FIXES_AND_IMPROVEMENTS.md` — Notes about bug fixes and improvements made in the project.
- `AGENTS.md` and `CLAUDE.md` — Project-specific instructions and contributor guidance for AI tooling.

## 9. Purpose summary by layer

### Frontend / UI
Used for rendering pages, components, and user interactions.

### Backend / API
Used for receiving requests, authenticating users, and serving data.

### Services
Used for GitHub integration, analytics processing, caching, sync logic, and business rules.

### Database
Used for persisting user, repository, commit, stats, and language information.

### Infrastructure / config
Used for project setup, linting, build, and environment configuration.

---

This project is structured so that:
- pages render UI
- API routes expose functionality
- services hold the logic
- Prisma models persist state
- auth/session files secure access and identity
