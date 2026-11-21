# FixMate — Frontend (AGENTS.md)

## Project overview

FixMate is a service-marketplace web app where **customers** book repair services,
**technicians** manage those requests, and **admins** oversee the platform. This repo is the
**Next.js 16 (App Router) frontend**; it is not a standalone app — business data lives in a
separate backend API reached via `NEXT_PUBLIC_API_URL`.

- Framework: **Next.js 16.4.6** with App Router (`src/app/`), React 19.3, TypeScript (strict).
- Styling: **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`, loaded via the
  `@tailwindcss/turbopack` loader rule in `next.config.ts` — do not add a `tailwind.config.*`).
- Auth: **Better Auth** (`better-auth` + MongoDB adapter + `jwt` plugin), with Google/GitHub OAuth.
- Payments: **Stripe Checkout** proxied through the backend
  (`/api/payments/create-checkout-session`, `/api/payments/verify-session`).
- Data: fetched from the external backend (client-side `useEffect` on dashboards, server
  `fetch` on home/services pages); MongoDB is only touched by Better Auth server-side
  (`src/lib/auth.ts`).
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
| `NEXT_PUBLIC_API_URL` | Every API consumer (`src/lib/services-api.ts`, dashboard pages, home components) | Base URL of the external backend API |
| `IMGBB_API_KEY` | `src/app/api/upload/route.ts` | Image hosting |

Never hardcode API URLs or secrets; read them from `process.env`. Stripe keys live on the
**backend** — this app only calls the backend's checkout/verify endpoints.

## Directory layout

```
src/
  app/
    layout.tsx              # Root layout: ThemeProvider > Navbar + main + Footer + ToastContainer
    page.tsx                # Home: HeroBanner + Suspense(FeaturedServices) + HowFixMateWorks + PopularCategories
    globals.css             # Tailwind v4 import + FixMate design tokens (light/dark)
    (auth)/signin|signup/   # Client-side auth pages
    api/auth/[...all]/      # Better Auth catch-all handler (toNextJsHandler)
    api/upload/             # POST image -> ImgBB -> { success, imageUrl }
    services/
      page.tsx              # Service list (client): filters + search via URLSearchParams
      [id]/page.tsx         # Service detail (server component, fetches directly)
      [id]/request/page.tsx # Repair request form (server wrapper -> RepairRequestForm)
    dashboard/
      admin/                # layout (server) -> AdminLayoutClient; page = overview; users|services|bookings|transactions = STUBS
      customer/             # layout (client), page, bookings/, payments/
      technician/           # layout (server) -> TechnicianLayoutClient; page, add-service/, my-services/, requests/, requests/[id]/
    profile/                # Profile page (authClient.useSession + updateUser)
    components/
      dashboard/{admin,customer,technician}/  # Sidebars, headers, *LayoutClient wrappers, stats widgets
      home/                 # HeroBanner, FeaturedServices (server), HowFixMateWorks, PopularCategories
      services/             # ServiceCard, ServiceDetails, ServiceFilters, RepairRequestForm
      shared/{navbar,footer}/, theme/, SignupSkeleton.tsx
  lib/
    auth.ts                 # betterAuth server config (role/phone/area/bio additional fields)
    auth-client.ts          # createAuthClient with jwtClient + inferAdditionalFields
    services-api.ts         # Shared API layer for services/repair-requests (see below)
    (getToken)/             # getTokenFromClient (authClient.token) / getTokenFromServer (auth.api.getToken)
  types/
    service.ts              # Service, Technician, ApiResponse<T> — shared API types
```

Path alias: `@/*` -> `./src/*` (tsconfig).

## Architecture rules — follow existing patterns

### Routing / roles

- Roles: `customer` | `technician` | `admin` (default `customer`), defined as a Better Auth
  `additionalFields.role`. After sign-in, `(auth)/signin/page.tsx` redirects by role to
  `/dashboard/customer`, `/dashboard/technician`, `/dashboard/admin`.
- Dashboard shell pattern: each role has a **server `layout.tsx`** that wraps a client
  component (`AdminLayoutClient`, `TechnicianLayoutClient`) inside `<Suspense>`; the client
  wrapper owns sidebar open state and renders header + sidebar + `<main>`.
  `dashboard/customer/layout.tsx` is still fully client-side — the odd one out.
- Navbar `UserInfo` computes `dashboardPath` from the session role; keep that logic in sync
  with the redirect table above.
- **Known gaps (do not assume they exist):**
  - There is **no `middleware.ts`** — routes are *not* server-guarded; dashboards are client
    components that assume a session. If you add protection, follow Next 16 docs first.
  - `src/app/dashboard/technician/requests/[id]/page.tsx` is an **empty file (0 bytes)**.
  - Admin sub-pages `dashboard/admin/{users,services,bookings,transactions}` are **stubs**
    (placeholder text only, no data fetching yet).
  - There is no `/my-bookings` route; bookings live at `/dashboard/customer/bookings`.

### Data fetching

**Dashboards (admin/customer/technician pages)** are `"use client"` and fetch in `useEffect`:

1. `const API_URL = process.env.NEXT_PUBLIC_API_URL;` and throw if unset.
2. `const token = await getTokenFromClient();` (from `@/lib/(getToken)/getTokenFromClient`).
3. `fetch(\`${API_URL}/api/...\`, { headers: { Authorization: \`Bearer ${token}\`, "Content-Type": "application/json" }, cache: "no-store" })`.
4. Backend responses are shaped `{ success: boolean; message?: string; data: T }` — check both
   `response.ok` and `result.success`; surface `result.message` as the error.
5. Use an `ignore` flag in the effect cleanup to avoid setState-after-unmount, and a
   `refreshKey` state for manual refresh.

**Services / repair requests** go through the shared layer `src/lib/services-api.ts`
(`getAllServices`, `getServiceById`, `createRepairRequest`) with types from
`src/types/service.ts`. Prefer extending this file over writing new inline `fetch` calls.
`createRepairRequest` attaches the Bearer token itself; the two GET helpers are public
(no token). 404 from `getServiceById` throws `Error("SERVICE_NOT_FOUND")` — callers convert
that to `notFound()`.

**Home**: `FeaturedServices` is an **async server component** fetching
`/api/featured-services` directly (wrapped in `<Suspense>` on the home page).
`HeroBanner`, `HowFixMateWorks`, `PopularCategories` are static.

Backend endpoints currently used:

- Services: `GET /api/services`, `GET /api/services/:id`, `GET/DELETE /api/services/my-services`,
  `POST /api/services`, `GET /api/featured-services`
- Service requests: `GET/POST /api/service-requests`,
  `GET /api/service-requests/customer`, `GET /api/service-requests/technician`,
  `PATCH /api/service-requests/:id/status`, `POST /api/service-requests/:id/cancel`
- Payments: `GET /api/payments/customer`, `POST /api/payments/create-checkout-session`,
  `POST /api/payments/verify-session`
- Admin: `GET /api/admin/overview`, `GET /api/admin/bookings`, `GET /api/admin/services`

Client token: `getTokenFromClient()`; server token: `getTokenFromServer()`. Keep them in
`src/lib/(getToken)/` — the folder name is intentional (route-group-style name) and is imported
verbatim: `@/lib/(getToken)/getTokenFromClient`.

### Auth

- Server config: `src/lib/auth.ts` (email+password min length 6, social providers, MongoDB
  adapter, `jwt()` plugin, 7-day JWT cookie cache).
- Client: always use `authClient` from `@/lib/auth-client` (`signIn`, `signUp`, `signOut`,
  `useSession`, `updateUser`, `token`). Never invent session helpers.
- The auth route handler at `src/app/api/auth/[...all]/route.ts` must stay a catch-all.
- `RepairRequestForm` enforces: signed-in user, `role === "customer"`, problem description
  >= 20 chars, preferred date >= today. Keep those guards when editing.

### Styling

- Use the design tokens exposed as Tailwind utilities in `globals.css`
  (`bg-background`, `text-foreground`, `bg-surface`, `bg-surface-secondary`, `border-border`,
  `text-muted`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`,
  `bg-success/10`, `text-warning`, `text-danger`, …). Prefer tokens over hardcoded hex values;
  hardcoded brand colors (`bg-[#102b25]`, `bg-[#b9e769]`) are reserved for the dark
  dashboard chrome/sidebars and footer — match the surrounding file.
- **Inconsistency to be aware of:** the `/services` pages and their skeletons use raw
  `gray-*` + `dark:` variants instead of tokens (e.g. `bg-gray-50 dark:bg-gray-950`).
  If you touch those files, prefer migrating new markup to tokens so it matches the rest.
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
route handlers/pages (e.g. `LayoutProps<"/">` in `layout.tsx`). Dynamic route `params` are a
**Promise** — `await params` in server components (see `services/[id]/page.tsx`). Consult
`node_modules/next/dist/docs/` before relying on remembered Next.js APIs.

## Conventions

- Commit style: Conventional Commits, imperative subject (`feat: add TechnicianRequestsPage ...`).
- Keep client/server boundaries explicit: anything using hooks or `authClient` needs `"use client"`.
- Strict TS is on — type API payloads with shared types from `src/types/service.ts` where they
  exist (`ApiResponse<T>`, `Service`), otherwise local interfaces, and cast Better Auth extra
  fields (`data.user as typeof data.user & { role?: string }`).
- Don't regenerate or delete the `nextjs-agent-rules` block above; commit it as-is.
