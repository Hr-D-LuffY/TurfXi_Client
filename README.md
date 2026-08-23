# TurfXI — Frontend

Base project setup for the TurfXI frontend, matching the config pattern of
the team's reference project (Next.js defaults: ESLint flat config,
`next.config.ts`, standard tsconfig — no extra strictness beyond what
`create-next-app` ships). This is mostly a skeleton — but a few pieces are
real, working infrastructure, not placeholders (see "What's actually wired
up" below).

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Server state / caching | TanStack Query |
| Client state (session only) | Zustand |
| Forms | react-hook-form + @hookform/resolvers (Zod) |
| Validation | Zod 4 (matches the backend's major version) |
| Auth token storage | js-cookie (storage) + jwt-decode (reading claims client-side) |
| Toasts | sonner |
| Real-time | Socket.io client |
| Linting | ESLint 9 (flat config) + eslint-config-next |

## Getting started

```bash
npm install
cp .env.example .env.local   # point at your running backend
npm run dev                  # http://localhost:3000
npm run lint                 # ESLint
```

The backend must be running for any actual API calls to succeed.

## What's actually wired up (not just stubbed)

Unlike the rest of this scaffold, these are real and tested — a full
`next build` + `eslint` pass both succeed:

- **`src/lib/auth-token.ts`** — reads/writes the JWT via a `js-cookie`
  cookie and decodes it with `jwt-decode`. The pairing of these two
  packages implies a specific pattern: the token lives in a
  client-readable (non-httpOnly) cookie and gets manually attached as a
  `Bearer` header on requests — not sent automatically like a normal
  cookie. **Confirm this actually matches what the backend's auth module
  issues** before relying on it; it's inferred from the dependency choice,
  not confirmed against real login code yet.
- **`src/features/auth/auth.store.ts`** — a small Zustand store holding
  the decoded token claims (`user`). This is the one piece of genuine
  global client state in the app; everything else is server state and
  belongs in TanStack Query, not here.
- **`src/lib/apiClient.ts`** — now actually attaches the `Authorization`
  header from `getToken()` on every request (unless `skipAuth: true` is
  passed).
- **`src/lib/socket.ts`** — passes the token in the Socket.io handshake
  `auth` callback, so the backend's socket auth handler has something
  real to validate.
- **`src/components/layout/Navbar.tsx`** — reads `useAuthStore` and
  actually swaps between logged-out (Log in / Sign up) and logged-in
  (email + Log out) states. Still needs a real profile menu, wallet
  balance, and notification bell — marked with a `TODO`.
- **`src/providers/AppProviders.tsx`** — mounts sonner's `<Toaster />`
  globally. `toast.error(...)` / `toast.success(...)` work from anywhere;
  wiring TanStack Query's global `onError` into it automatically is still
  a `TODO`.

## Project structure

```
src/
  app/                # Next.js App Router — one route per page
    (auth)/login, (auth)/register
    turfs/, turfs/[turfId]/
    bookings/, bookings/[bookingId]/
    wallet/
    missing-players/
    teams/, teams/[teamId]/
    players/[playerId]/       # match & stats (tiered) profile
    tournaments/, tournaments/[tournamentId]/
    notifications/
    messages/
    admin/
    owner/                     # turf owner dashboard
  features/            # one folder per backend module — mirrors src/modules
                         # in the backend repo 1:1
    <name>/
      <name>.types.ts   # Zod schema + inferred TS type
      <name>.api.ts     # calls apiClient, hits the matching backend route
      <name>.hooks.ts   # TanStack Query hooks for components to consume
    auth/
      auth.store.ts      # the one Zustand store in the app
  components/
    ui/                 # shared primitives (buttons, inputs, etc.)
    layout/              # Navbar
  providers/
    QueryProvider.tsx    # TanStack Query client
    AppProviders.tsx      # stacks providers + mounts the toast host
  lib/
    env.ts                # Zod-validated NEXT_PUBLIC_* env vars
    apiClient.ts            # fetch wrapper, attaches the auth header
    auth-token.ts            # cookie storage + JWT decode
    socket.ts                 # Socket.io client singleton
public/                # static assets — empty for now
```

**Note on `cancellations`, `splitBilling`, and `ratings`:** these three have
a `features/` folder (types/api/hooks) but no dedicated top-level route —
they're actions and widgets that live inside other pages (a cancel button
and refund preview inside `/bookings/[bookingId]`, split-billing status on
the same page, a rating widget inside `/turfs/[turfId]`).

## Why no `.js` extensions on imports

Next.js never hands TypeScript straight to Node — everything goes through
its own compiler (Turbopack/SWC) first, which resolves `./foo` to `foo.tsx`
on its own. Relative imports stay extension-free.

## Before splitting into individual work

1. **Build out the auth module for real** — confirm (or change) the
   cookie-storage / header-attachment pattern `auth-token.ts` assumes,
   wire up the actual login/register forms (react-hook-form +
   `zodResolver` are already installed), and call `setToken()` +
   `useAuthStore.setUser()` on success.
2. **Confirm `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SOCKET_URL`** in
   `.env.local` match wherever the backend actually runs.

## Known upstream note

`eslint@9` is EOL upstream (ESLint's current major is 10) — kept at `^9`
to match `eslint-config-next`'s compatibility, but worth revisiting once
`eslint-config-next` ships explicit v10 support.

## Module ownership

| Route(s) / feature(s) | Owner |
|---|---|
| turfs, bookings, owner | |
| wallet, splitBilling | |
| cancellations, missing-players, teams | |
| players (match stats), tournaments | |
| notifications, messages, ratings, admin | |
