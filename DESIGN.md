# TurfXI Design System (DESIGN.md)

This document establishes the official visual identity, tokens, and design standards for TurfXI across all client surfaces.

---

## 1. Aesthetic Direction
- **Identity:** Modern athletic tech platform for turf discovery, competitive matches, and tournaments.
- **Tone:** Crisp, energetic, high contrast, clean, and reliable.
- **Principles:**
  - Fast visual hierarchy with high data clarity.
  - Zero arbitrary hex values inside components — use semantic Tailwind tokens and CSS variables.
  - Generous tap targets (min 44px) on mobile viewports.
  - Full keyboard accessibility and WCAG AA contrast.

---

## 2. Color Palette & Semantic Tokens

### Core Colors (via Tailwind v4 & Shadcn CSS variables)
- **Background (`--background`):** Clean white `oklch(1 0 0)` / Dark `oklch(0.145 0 0)`
- **Foreground (`--foreground`):** Deep charcoal slate `oklch(0.145 0 0)` / Dark `oklch(0.985 0 0)`
- **Card (`--card`):** Elevated crisp surface `oklch(1 0 0)` with subtle border
- **Border (`--border`):** Neutral gray line `oklch(0.922 0 0)`
- **Primary (`--primary`):** Athletic pitch black/slate `oklch(0.205 0 0)`
- **Primary Foreground (`--primary-foreground`):** Pure white `oklch(0.985 0 0)`
- **Secondary (`--secondary`):** Muted slate gray `oklch(0.97 0 0)`
- **Muted Foreground (`--muted-foreground`):** Readable neutral `oklch(0.556 0 0)`
- **Accent Emerald (Sports Turf Accent):**
  - Brand Green: `emerald-600` (`#059669`) / `emerald-500` (`#10b981`)
  - Subdued Turf Tint: `emerald-50` (`#ecfdf5`) for badges and highlighted slots
- **Destructive:** `oklch(0.577 0.245 27.325)`

---

## 3. Typography Scale (Geist Sans)
- **Display / Hero:** `text-3xl font-bold tracking-tight md:text-4xl`
- **Page Titles:** `text-2xl font-bold tracking-tight md:text-3xl`
- **Section Headers:** `text-lg font-semibold tracking-tight`
- **Card Titles:** `text-base font-semibold`
- **Body Regular:** `text-sm leading-relaxed text-foreground`
- **Body Muted / Subtext:** `text-sm text-muted-foreground`
- **Caption / Badges:** `text-xs font-medium`

---

## 4. Spacing & Elevation
- **Container Max Width:** `max-w-md` (auth forms), `max-w-5xl` (content pages), `max-w-7xl` (discovery views)
- **Form Spacing:** `space-y-4`, `gap-3`, `gap-4`
- **Card Padding:** `p-6` (desktop), `p-4` (mobile 390px)
- **Border Radius:**
  - Base: `rounded-lg` (10px)
  - Inputs & Buttons: `rounded-md` (8px)
  - Badges & Avatars: `rounded-full`

---

## 5. Interactive States & Accessibility
- **Hover:** Subtle brightness or background shift (`hover:bg-primary/90`, `hover:border-foreground/30`).
- **Focus Visible:** `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none`.
- **Disabled:** `disabled:opacity-50 disabled:cursor-not-allowed`.
- **Icons:** Always use Lucide SVG icons (`lucide-react`). Never use emojis.
- **Motion:** Transitions with `transition-colors duration-150` or `transition-all`. Always respect `motion-reduce`.
