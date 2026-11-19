# FixMate — Frontend (AGENTS.md)

## Project overview

FixMate is a service-marketplace web app where **customers** book repair services and
**technicians** manage those requests. This repo is the **Next.js 16 (App Router) frontend**;
it is not a standalone app — business data lives in a separate backend API reached via
`NEXT_PUBLIC_API_URL`.

- Framework: **Next.js 16.4.6** with App Router (`src/app/`), React 19.3, TypeScript (strict).
- Styling: **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`, loaded via the
  `@tailwindcss/turbopack` loader rule in `next.config.ts` — do not add a `tailwind.config.*`).
- Auth: **Better Auth** (`better-auth` + MongoDB adapter + `jwt` plugin), with Google/GitHub OAuth.
- Data: fetched client-side from the external backend; MongoDB is only touched by Better Auth
  server-side (`src/lib/auth.ts`).
- UI extras: `lucide-react` icons, `react-toastify` toasts, `next-themes` dark mode.

## Commands

```bash
npm run dev     # next dev (Turbopack)
npm run build   # next build
npm run start   # next start
npm run lint    # eslint (flat config, eslint-config-next)
```

## Environment variables (`.env`)

| Variable | Used by | Purpose |
| --- | --- | --- |
| `MONGODB_URL` | `src/lib/auth.ts` | MongoDB connection for Better Auth (db name is hardcoded: `fix-mate`) |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Better Auth server / `src/lib/auth-client.ts` | Auth signing + client base URL |
| `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET` | `src/lib/auth.ts` | Social providers |
| `NEXT_PUBLIC_API_URL` | Dashboard pages | Base URL of the external backend API |
| `IMGBB_API_KEY` | `src/app/api/upload/route.ts` | Image hosting |

Never hardcode API URLs or secrets; read them from `process.env`.

## Directory layout

```
src/
  app/
    layout.tsx              # Root layout: ThemeProvider > Navbar + main + Footer + ToastContainer
    page.tsx                # Home (HeroBanner only; other sections are TODO)
    globals.css             # Tailwind v4 import + FixMate design tokens (light/dark)
    (auth)/signin|signup/   # Client-side auth pages
    api/auth/[...all]/      # Better Auth catch-all handler (toNextJsHandler)
    api/upload/             # POST image -> ImgBB -> { success, imageUrl }
    dashboard/customer/     # layout.tsx (sidebar shell), page, bookings/, payments/
    dashboard/technician/   # layout.tsx (sidebar shell), page, add-service/, my-services/, requests/, requests/[id]/
    profile/                # Profile page (authClient.useSession + updateUser)
    components/
      dashboard/{customer,technician}/  # Sidebars, headers, stats widgets
      home/, shared/{navbar,footer}/, theme/, SignupSkeleton.tsx
  lib/
    auth.ts                 # betterAuth server config (role/phone/area/bio additional fields)
    auth-client.ts          # createAuthClient with jwtClient + inferAdditionalFields
    (getToken)/             # getTokenFromClient (authClient.token) / getTokenFromServer (auth.api.getToken)
```

Path alias: `@/*` -> `./src/*` (tsconfig).

## Architecture rules — follow existing patterns

### Routing / roles

- Roles: `customer` | `technician` | `admin` (default `customer`), defined as a Better Auth
  `additionalFields.role`. After sign-in, `(auth)/signin/page.tsx` redirects by role to
  `/dashboard/customer`, `/dashboard/technician`, `/dashboard/admin`.
- **Known gaps (do not assume they exist):**
  - There is **no `/dashboard/admin` route** yet — creating it is expected work.
  - There is **no `middleware.ts`** — routes are *not* server-guarded; dashboards are client
    components that assume a session. If you add protection, follow Next 16 docs first.
  - `src/app/dashboard/technician/requests/[id]/page.tsx` is currently an **empty file**.
  - `CustomerSidebar` logs out to `/sign-in`, but the real route is `(auth)/signin` -> `/signin`.
    Links to `/services` and `/signup` also need matching routes before they work.

### Data fetching (dashboard pages)

All dashboard pages are `"use client"` and fetch in `useEffect`. The established pattern:

1. `const API_URL = process.env.NEXT_PUBLIC_API_URL;` and throw if unset.
2. `const token = await getTokenFromClient();` (from `@/lib/(getToken)/getTokenFromClient`).
3. `fetch(\`${API_URL}/api/...\`, { headers: { Authorization: \`Bearer ${token}\`, "Content-Type": "application/json" }, cache: "no-store" })`.
4. Backend responses are shaped `{ success: boolean; message?: string; data: T }` — check both
   `response.ok` and `result.success`; surface `result.message` as the error.
5. Use an `ignore` flag in the effect cleanup to avoid setState-after-unmount, and a
   `refreshKey` state for manual refresh.

Backend endpoints currently used:

- `GET/POST /api/service-requests/customer`, `/api/service-requests/technician`,
  `PATCH /api/service-requests/:id/status`
- `GET /api/payments/customer`
- `GET/POST /api/services`, `GET/DELETE /api/services/my-services`

Client token: `getTokenFromClient()`; server token: `getTokenFromServer()`. Keep them in
`src/lib/(getToken)/` — the folder name is intentional (route-group-style name) and is imported
verbatim: `@/lib/(getToken)/getTokenFromClient`.

### Auth

- Server config: `src/lib/auth.ts` (email+password min length 6, social providers, MongoDB
  adapter, `jwt()` plugin, 7-day JWT cookie cache).
- Client: always use `authClient` from `@/lib/auth-client` (`signIn`, `signUp`, `signOut`,
  `useSession`, `updateUser`, `token`). Never invent session helpers.
- The auth route handler at `src/app/api/auth/[...all]/route.ts` must stay a catch-all.

### Styling

- Use the design tokens exposed as Tailwind utilities in `globals.css`
  (`bg-background`, `text-foreground`, `bg-surface`, `border-border`, `text-muted`,
  `bg-primary`, `text-primary-foreground`, `bg-success/10`, `text-warning`, `text-danger`, …).
  Prefer tokens over hardcoded hex values; hardcoded palette colors (e.g. `bg-[#102b25]`,
  `bg-[#b9e769]`) appear only in the dashboard chrome — match the surrounding file.
- Dark mode is class-based via `next-themes` (`attribute="class"`, default `light`,
  `enableSystem={false}`) in `ThemeProvider`; `<html>` has `suppressHydrationWarning`.
- Icons come from `lucide-react` only. Feedback uses `toast` from `react-toastify`
  (`ToastContainer` is already mounted in the root layout — don't mount another).
- Images: `<next/image>` with remote hosts allowed in `next.config.ts` (currently `i.ibb.co`
  plus a permissive `**` hostname — be aware this is wide open).

### Image uploads

Uploads go through `POST /api/upload` with `FormData` field `image` (JPEG/PNG/WEBP, max 5MB),
which proxies to ImgBB and returns `{ success: true, imageUrl }`. Client code must handle
`uploadResponse.ok === false` by reading `{ error }` from the body.

## Next.js version warning

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Note: `next.config.ts` enables `cacheComponents`, `partialPrefetching`, `reactCompiler`
(babel-plugin-react-compiler) and `experimental.agentFeedback`, and types are generated for
route handlers/pages (e.g. `LayoutProps<"/">` in `layout.tsx`). Consult
`node_modules/next/dist/docs/` before relying on remembered Next.js APIs.

## Conventions

- Commit style: Conventional Commits, imperative subject (`feat: add TechnicianRequestsPage ...`).
- Keep client/server boundaries explicit: anything using hooks or `authClient` needs `"use client"`.
- Strict TS is on — type API payloads with local interfaces (see `ApiResponse<T>` in dashboard pages)
  and cast Better Auth extra fields (`data.user as typeof data.user & { role?: string }`).
- Don't regenerate or delete the `nextjs-agent-rules` block above; commit it as-is.
