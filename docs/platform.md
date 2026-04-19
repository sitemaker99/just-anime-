# Anirohi Platform Documentation

> Anirohi is a free anime streaming web application that provides a clean, ad-free viewing experience. Users can browse anime by category, search for specific titles, watch episodes with multiple server options, track their watch progress, save series to a personal list, and view upcoming episode schedules. The platform focuses on a minimalist, modern dark-themed UI with smooth animations and responsive design.

---

## Table of Contents

1. [Application Overview](#application-overview)
2. [Visual Sitemap](#visual-sitemap)
3. [Screens & Navigation](#screens--navigation)
4. [Core Components](#core-components)
5. [State Management](#state-management)
6. [Data Flow & Logic](#data-flow--logic)
7. [Backend Integration](#backend-integration)

---

## Application Overview

### Tech Stack at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 16       │  Tailwind CSS v4   │  shadcn/ui + Radix    │
│  App Router       │  oklch colors      │  Embla Carousel       │
│  React 19         │  tw-animate-css    │  Vidstack Player      │
├─────────────────────────────────────────────────────────────────┤
│                         STATE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  TanStack Query   │  nuqs              │  useSyncExternalStore │
│  Server state     │  URL state mgmt    │  LocalStorage hooks   │
├─────────────────────────────────────────────────────────────────┤
│                        RUNTIME LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Vite/Next.js     │  Edge Runtime      │  oRPC                 │
│  React Compiler   │  Proxy API         │  HiAnime Scraper      │
└─────────────────────────────────────────────────────────────────┘
```

### Key Files Map

```
src/
│
├── app/
│   ├── layout.tsx ─────────────── Root layout with NuqsAdapter + QueryProvider
│   ├── page.tsx ───────────────── Landing page with hero search
│   │
│   ├── home/
│   │   └── page.tsx ───────────── Main home with spotlight + content sections
│   │
│   ├── browse/
│   │   ├── page.tsx ───────────── Browse wrapper with hero header
│   │   └── browse-content.tsx ─── Category filters + infinite scroll grid
│   │
│   ├── anime/[id]/
│   │   └── page.tsx ───────────── Anime detail with info + save + watch
│   │
│   ├── watch/[id]/[episode]/
│   │   └── page.tsx ───────────── Video player + episode list + servers
│   │
│   ├── schedule/
│   │   ├── page.tsx ───────────── Schedule wrapper with hero header
│   │   └── schedule-content.tsx ─ Date picker + release list
│   │
│   ├── saved/
│   │   └── page.tsx ───────────── User's saved series grid
│   │
│   ├── api/proxy/
│   │   └── route.ts ───────────── Edge proxy for HLS/VTT/images
│   │
│   └── rpc/[[...rest]]/
│       └── route.ts ───────────── oRPC API handler
│
├── components/
│   ├── ui/ ────────────────────── shadcn/ui primitives (button, dialog, etc.)
│   └── blocks/ ────────────────── Page sections (navbar, footer, carousel)
│
├── hooks/
│   ├── use-watch-progress.ts ──── Episode progress tracking
│   ├── use-saved-series.ts ────── Saved series management
│   └── use-player-preferences.ts  Player settings persistence
│
└── lib/
    ├── orpc/ ──────────────────── API router + procedures
    ├── query/ ─────────────────── TanStack Query setup
    ├── aniwatch/ ──────────────── HiAnime scraper singleton
    └── proxy.ts ───────────────── Proxy URL generator
```

---

## Visual Sitemap

### Application Navigation Structure

```
                              ┌─────────────┐
                              │  layout.tsx │
                              │  (Providers)│
                              └──────┬──────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
  │   Landing   │            │    Home     │            │   Browse    │
  │      /      │            │   /home     │            │   /browse   │
  └──────┬──────┘            └──────┬──────┘            └─────────────┘
         │                          │
         │    ┌─────────────────────┼─────────────────────┐
         │    │                     │                     │
         │    ▼                     ▼                     ▼
         │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐
         │  │   Anime     │  │  Schedule   │  │       Saved         │
         │  │ /anime/[id] │  │  /schedule  │  │       /saved        │
         │  └──────┬──────┘  └─────────────┘  └─────────────────────┘
         │         │
         │         ▼
         │  ┌──────────────────────┐
         └─▶│       Watch          │
            │ /watch/[id]/[episode]│
            └──────────────────────┘
```

### User Journey Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐       │
│   │ Landing │ ───▶ │  Home   │ ───▶ │  Anime  │ ───▶ │  Watch  │       │
│   │  Page   │      │  Page   │      │ Detail  │      │  Page   │       │
│   └────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘       │
│        │                │                │                 │            │
│        │                ▼                ▼                 │            │
│        │         ┌───────────┐    ┌───────────┐           │            │
│        └────────▶│  Search   │    │   Save    │           │            │
│                  │  (Cmd+K)  │    │  Series   │           │            │
│                  └───────────┘    └─────┬─────┘           │            │
│                                         │                 │            │
│                                         ▼                 │            │
│                                   ┌───────────┐           │            │
│                                   │   Saved   │◀──────────┘            │
│                                   │   Page    │                        │
│                                   └───────────┘                        │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    CONTINUE WATCHING FLOW                        │   │
│   │   Watch Page ──▶ Progress Saved ──▶ Home "Continue" ──▶ Resume  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Screens & Navigation

### Screen Overview Table

| # | Screen | Route | File | Purpose |
|---|--------|-------|------|---------|
| 1 | Landing | `/` | `src/app/page.tsx` | Hero search + trending preview |
| 2 | Home | `/home` | `src/app/home/page.tsx` | Spotlight carousel + content sections |
| 3 | Browse | `/browse` | `src/app/browse/` | Category filtering + infinite scroll |
| 4 | Anime Detail | `/anime/[id]` | `src/app/anime/[id]/page.tsx` | Series info, save, watch actions |
| 5 | Watch | `/watch/[id]/[ep]` | `src/app/watch/[id]/[episode]/page.tsx` | Video player + episode selection |
| 6 | Schedule | `/schedule` | `src/app/schedule/` | Weekly release schedule |
| 7 | Saved | `/saved` | `src/app/saved/page.tsx` | User's saved series list |
| 8 | Contact | `/contact` | `src/app/contact/page.tsx` | Contact information |
| 9 | DMCA | `/dmca` | `src/app/dmca/page.tsx` | DMCA policy |
| 10 | Terms | `/terms` | `src/app/terms/page.tsx` | Terms of service |
| 11 | Privacy | `/privacy` | `src/app/privacy/page.tsx` | Privacy policy |

---

### 1. Landing Page (`/`)

**File:** `src/app/page.tsx`

> The entry point featuring a cinematic hero search experience for quick anime discovery. A minimal, focused interface that encourages immediate engagement with a prominent search bar and trending anime preview grid.

#### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     [Gradient backdrop with glows]                       │
│                                                                          │
│                         ┌────────────────────┐                          │
│                         │     ani rohi       │                          │
│                         │   (Logo + accent)  │                          │
│                         └────────────────────┘                          │
│                                                                          │
│                  "Stream anime. No interruptions."                       │
│                                                                          │
│               ┌─────────────────────────────────────┐                   │
│               │  🔍  Search anime...                │                   │
│               └─────────────────────────────────────┘                   │
│                     ┌─────────────────────────┐                         │
│                     │  [Search results dropdown] │                      │
│                     │  • Anime 1               │                         │
│                     │  • Anime 2               │                         │
│                     └─────────────────────────┘                         │
│                                                                          │
│                      Browse all anime  →                                 │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                              TRENDING                                    │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                  │
│  │     │  │     │  │     │  │     │  │     │  │     │                  │
│  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │                  │
│  │     │  │     │  │     │  │     │  │     │  │     │                  │
│  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘                  │
│    Title    Title    Title    Title    Title    Title                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### User Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| Type in search | `onChange` (min 2 chars) | Debounced API search, dropdown appears |
| Click search result | Link click | Navigate to `/anime/[id]` |
| Click "Browse all anime" | Link click | Navigate to `/home` |
| Click trending poster | Link click | Navigate to `/anime/[id]` |

---

### 2. Home Page (`/home`)

**File:** `src/app/home/page.tsx`

> The main content hub featuring a spotlight carousel of featured anime, continue watching section for returning users, and categorized content grids for trending, latest episodes, and top airing series.

#### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Navbar]   aniflix   Home  Browse  Schedule  Saved  [🔍] [🐙]   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      SPOTLIGHT CAROUSEL                           │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │  [Background poster with gradients]                          │ │   │
│  │  │                                                              │ │   │
│  │  │  #1 Spotlight                                                │ │   │
│  │  │  Anime Title                                                 │ │   │
│  │  │  Description text...                                         │ │   │
│  │  │                                                              │ │   │
│  │  │  [▶ Watch]  [Details]                                        │ │   │
│  │  │                                                              │ │   │
│  │  │                          ○ ● ○ ○ ○ ○                        │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  CONTINUE WATCHING (conditional - shows if has progress)         │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐           │   │
│  │  │EP 5 │  │EP 12│  │EP 3 │  │EP 8 │  │EP 1 │  │EP 24│           │   │
│  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │           │   │
│  │  │[===]│  │[===]│  │[===]│  │[===]│  │[===]│  │[===]│           │   │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘           │   │
│  │  Title    Title    Title    Title    Title    Title              │   │
│  │  12:34    8:22     15:00    4:30     22:11    18:45              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  TRENDING                                          View all →    │   │
│  │  [6-column grid of anime posters with titles]                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  LATEST EPISODES                                   View all →    │   │
│  │  [6-column grid of anime posters with titles]                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  TOP AIRING                                                      │   │
│  │  [6-column grid of anime posters with titles]                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Footer] aniflix - Explore - Legal - Connect                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### UI Components Breakdown

| Section | Component | Description |
|---------|-----------|-------------|
| Header | `<Navbar />` | Fixed nav with logo, links, search trigger, GitHub |
| Hero | `<SpotlightCarousel />` | Auto-rotating carousel (6s) with poster backgrounds |
| Continue | `<ContinueWatchingGrid />` | Recently watched with progress bars |
| Content | `<AnimeGrid />` | Reusable grid for trending/latest/airing |
| Footer | `<Footer />` | Brand, navigation columns, legal links |

#### User Interactions

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CAROUSEL INTERACTION                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Auto-rotate (6s interval)                                               │
│       │                                                                  │
│       ├── Mouse enters carousel ──▶ Pause rotation                       │
│       ├── Mouse leaves carousel ──▶ Resume rotation                      │
│       └── Click dot indicator ──▶ Jump to specific slide                 │
│                                                                          │
│  Click "Watch" button ──▶ Navigate to /watch/[id]/1                      │
│  Click "Details" button ──▶ Navigate to /anime/[id]                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Browse Page (`/browse`)

**File:** `src/app/browse/page.tsx`, `src/app/browse/browse-content.tsx`

> Category-based anime browsing with sticky filter pills and infinite scroll pagination. Supports 14 different categories including popularity, type, and language filters.

#### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Navbar]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Hero image with "Browse" title]                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  CATEGORY FILTER (sticky)                                         │   │
│  │  [Popular] [Favorite] [Airing] [Updated] [New] [Upcoming] ...     │   │
│  │  [Completed] [Sub] [Dub] [Movies] [TV] [OVA] [ONA] [Special]      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  POPULAR                                                          │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐            │   │
│  │  │     │  │     │  │     │  │     │  │     │  │     │            │   │
│  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │  │ 📺  │            │   │
│  │  │     │  │     │  │     │  │     │  │     │  │     │            │   │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘            │   │
│  │   Title    Title    Title    Title    Title    Title             │   │
│  │   TV·24    Movie    TV·12    TV·13    TV·26    OVA·2             │   │
│  │                                                                   │   │
│  │  [... more rows ...]                                              │   │
│  │                                                                   │   │
│  │                     [Load More]                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Footer]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Categories Available

| ID | Label | Description |
|----|-------|-------------|
| `most-popular` | Popular | Most viewed anime |
| `most-favorite` | Favorite | Highest rated anime |
| `top-airing` | Airing | Currently airing series |
| `recently-updated` | Updated | Latest episode releases |
| `recently-added` | New | Newly added to catalog |
| `top-upcoming` | Upcoming | Not yet released |
| `completed` | Completed | Finished airing |
| `subbed-anime` | Sub | Japanese audio |
| `dubbed-anime` | Dub | English dubbed |
| `movie` | Movies | Anime movies |
| `tv` | TV | TV series |
| `ova` | OVA | Original video animation |
| `ona` | ONA | Original net animation |
| `special` | Special | Special episodes |

#### URL State

- `?category=most-popular` (default)

---

### 4. Anime Detail Page (`/anime/[id]`)

**File:** `src/app/anime/[id]/page.tsx`

> Comprehensive information page showing anime metadata, synopsis, related series, and recommendations. Supports saving to personal list and resuming from last watched episode.

#### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Navbar]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Hero: Blurred poster background with gradients]                 │   │
│  │                                                                   │   │
│  │  ┌────────┐                                                       │   │
│  │  │        │  TV · Airing · Apr 2024                               │   │
│  │  │        │                                                       │   │
│  │  │ Poster │  Anime Title                                          │   │
│  │  │        │  Japanese Title                                       │   │
│  │  │        │                                                       │   │
│  │  │        │  24 episodes (Sub) · 24 min · Studio Name · PG-13     │   │
│  │  │        │                                                       │   │
│  │  └────────┘  [▶ Watch] or [▶ Continue EP 5]   [🔖 Save/Saved]     │   │
│  │                                                                   │   │
│  │              [Action] [Adventure] [Fantasy] [Comedy]              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  SYNOPSIS                              │  INFORMATION            │   │
│  │                                        │  ┌────────────────────┐ │   │
│  │  Long description of the anime         │  │ Type:    TV        │ │   │
│  │  story, plot, and characters...        │  │ Episodes: 24       │ │   │
│  │                                        │  │ Status:  Airing    │ │   │
│  │                                        │  │ Aired:   Apr 2024  │ │   │
│  │                                        │  │ Duration: 24 min   │ │   │
│  │                                        │  │ Studio:  MAPPA     │ │   │
│  │                                        │  │ MAL:     8.5       │ │   │
│  │                                        │  └────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  RELATED ANIME                                                    │   │
│  │  [6 related anime posters in grid]                                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  YOU MAY ALSO LIKE                                                │   │
│  │  [6 recommended anime posters in grid]                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Footer]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### User Interactions

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SAVE SERIES FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User clicks "Save" button                                               │
│       │                                                                  │
│       ▼                                                                  │
│  toggleSave({ id, name, poster })                                        │
│       │                                                                  │
│       ├── If not saved ──▶ Add to localStorage array with timestamp     │
│       │                    └──▶ Toast: "Added to saved"                  │
│       │                                                                  │
│       └── If saved ──▶ Remove from localStorage array                   │
│                        └──▶ Toast: "Removed from saved"                  │
│                                                                          │
│  Button text updates: "Save" ↔ "Saved" with filled/outline icon         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Watch Page (`/watch/[id]/[episode]`)

**File:** `src/app/watch/[id]/[episode]/page.tsx`

> Full-featured video player experience with HLS streaming, subtitle support, skip intro/outro buttons, episode navigation, server selection, and automatic progress tracking.

#### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  aniflix  >  Anime Title  >  EP 5                    [breadcrumb] │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────┐  ┌──────────────────────┐  │
│  │                                         │  │  ┌────────┐          │  │
│  │                                         │  │  │ Poster │ Title    │  │
│  │          VIDEO PLAYER                   │  │  │        │ TV · 24  │  │
│  │          (Vidstack)                     │  │  └────────┘          │  │
│  │                                         │  │                      │  │
│  │                                         │  │  EPISODES (24 total) │  │
│  │                     [Skip Intro]        │  │  ┌──┬──┬──┬──┬──┬──┐ │  │
│  │  [controls: play, volume, CC, FS]       │  │  │1 │2 │3 │4 │●5│6 │ │  │
│  └─────────────────────────────────────────┘  │  ├──┼──┼──┼──┼──┼──┤ │  │
│                                               │  │7 │8 │9 │10│11│12│ │  │
│  ┌─────────────────────────────────────────┐  │  └──┴──┴──┴──┴──┴──┘ │  │
│  │  EP 5                                   │  │  [■ Current] [■ Fill]│  │
│  │  Anime Title                            │  │                      │  │
│  │  Episode Title (if filler: FILLER)      │  │  UP NEXT             │  │
│  │                            [◀ Prev][▶]  │  │  ┌────┐ Related 1    │  │
│  └─────────────────────────────────────────┘  │  └────┘              │  │
│                                               │  ┌────┐ Related 2    │  │
│  ┌─────────────────────────────────────────┐  │  └────┘              │  │
│  │  SERVERS                                 │  │  ┌────┐ Related 3    │  │
│  │  Audio: [SUB] [DUB]                      │  │  └────┘              │  │
│  │  Server: [hd-1] [hd-2] [megacloud] ...   │  │                      │  │
│  └─────────────────────────────────────────┘  └──────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Player Features

| Feature | Implementation |
|---------|---------------|
| HLS Streaming | Vidstack with HLS.js, proxied through `/api/proxy` |
| Subtitles | Multi-language VTT tracks with preference memory |
| Thumbnails | Seek bar thumbnails from VTT sprite sheets |
| Skip Intro/Outro | Context-aware buttons during intro/outro timestamps |
| Progress Tracking | Auto-saves every 5 seconds to localStorage |
| Position Restore | Resumes from saved position (if > 5s, < 95%) |
| Preferences | Remembers volume, playback rate, caption language |
| Prefetching | Adjacent episodes prefetched for instant navigation |

#### URL State

| Parameter | Values | Default | Purpose |
|-----------|--------|---------|---------|
| `category` | `sub`, `dub` | `sub` | Audio track selection |
| `server` | `hd-1`, `hd-2`, `megacloud`, `streamsb`, `streamtape` | `hd-1` | Streaming server |
| `range` | `0`, `1`, `2`, ... | Auto-detected | Episode range (80 per chunk) |

#### Video Playback Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        VIDEO PLAYBACK LIFECYCLE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Page mounts                                                             │
│       │                                                                  │
│       ├──▶ Fetch anime info, episodes, servers                          │
│       └──▶ Fetch episode sources (HLS URL + tracks)                     │
│                                                                          │
│  Player loads source                                                     │
│       │                                                                  │
│       └──▶ onProviderChange: Configure HLS.js (no credentials)          │
│                                                                          │
│  Video can play (onCanPlay)                                              │
│       │                                                                  │
│       ├──▶ Restore playback rate from preferences                       │
│       ├──▶ Restore volume/mute from preferences                         │
│       └──▶ If saved progress exists && valid ──▶ Seek to position       │
│                                                                          │
│  Video playing (onTimeUpdate - throttled 5s)                             │
│       │                                                                  │
│       ├──▶ If currentTime < 5s ──▶ Skip (too early)                      │
│       ├──▶ If >= 95% OR remaining < 60s ──▶ Clear progress (completed)  │
│       └──▶ Otherwise ──▶ Save progress to localStorage                  │
│                                                                          │
│  User changes settings                                                   │
│       │                                                                  │
│       ├──▶ onVolumeChange ──▶ Save volume preference                    │
│       ├──▶ onRateChange ──▶ Save playback rate preference               │
│       └──▶ onTextTrackChange ──▶ Save caption language preference       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 6. Schedule Page (`/schedule`)

**File:** `src/app/schedule/page.tsx`, `src/app/schedule/schedule-content.tsx`

> Weekly anime release schedule with a 7-day date picker showing upcoming episode releases with airing times.

#### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Navbar]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Hero image with "Schedule" title]                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  DATE PICKER (sticky)                                             │   │
│  │  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ...      │   │
│  │  │ Today │  │ Tmrw  │  │  Wed  │  │  Thu  │  │  Fri  │           │   │
│  │  │  17   │  │  18   │  │  19   │  │  20   │  │  21   │           │   │
│  │  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  TODAY                                            12 releases     │   │
│  │                                                                   │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ 14:30  │  Anime Title                               EP 5   │  │   │
│  │  │        │  Japanese Title                                   │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ 15:00  │  Another Anime                             EP 12  │  │   │
│  │  │        │  Japanese Title                                   │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                   │   │
│  │  [... more schedule items ...]                                    │   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Footer]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### URL State

- `?date=2025-12-17` (ISO date format, defaults to today)

---

### 7. Saved Page (`/saved`)

**File:** `src/app/saved/page.tsx`

> Personal list of saved anime series with watch progress indicators and quick resume functionality.

#### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Navbar]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Saved Series                                                     │   │
│  │  5 series saved                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐              │   │
│  │  │[EP 5]   │  │         │  │[EP 12]  │  │         │              │   │
│  │  │         │  │         │  │         │  │         │              │   │
│  │  │  📺     │  │  📺     │  │  📺     │  │  📺     │              │   │
│  │  │       X │  │       X │  │       X │  │       X │              │   │
│  │  │[=====  ]│  │         │  │[===    ]│  │         │              │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘              │   │
│  │    Title        Title        Title        Title                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ─────────────────── OR (empty state) ───────────────────────────────   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                          🔖                                       │   │
│  │                No saved series yet                                │   │
│  │     Browse anime and click save to add them to your list         │   │
│  │                                                                   │   │
│  │                    [Browse Anime]                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Footer]                                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### User Interactions

| Action | Result |
|--------|--------|
| Click card with progress | Navigate to `/watch/[id]/[episode]` (resume) |
| Click card without progress | Navigate to `/anime/[id]` (details) |
| Click X (remove) | Remove from saved + toast notification |

---

## Core Components

### Component Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT HIERARCHY                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                           ┌──────────────┐                               │
│                           │  layout.tsx  │                               │
│                           │ NuqsAdapter  │                               │
│                           │ QueryProvider│                               │
│                           └──────┬───────┘                               │
│                                  │                                       │
│              ┌───────────────────┼───────────────────┐                   │
│              │                   │                   │                   │
│              ▼                   ▼                   ▼                   │
│       ┌──────────┐        ┌──────────┐        ┌──────────┐              │
│       │  Pages   │        │  Pages   │        │  Pages   │              │
│       │ (landing)│        │  (home)  │        │ (browse) │              │
│       └────┬─────┘        └────┬─────┘        └────┬─────┘              │
│            │                   │                   │                     │
│            │    ┌──────────────┼──────────────┐    │                    │
│            │    │              │              │    │                    │
│            ▼    ▼              ▼              ▼    ▼                    │
│         ┌─────────────────────────────────────────────┐                 │
│         │              BLOCK COMPONENTS               │                 │
│         │  Navbar, Footer, CommandMenu, Spotlight     │                 │
│         └─────────────────────┬───────────────────────┘                 │
│                               │                                          │
│                               ▼                                          │
│         ┌─────────────────────────────────────────────┐                 │
│         │              UI PRIMITIVES                  │                 │
│         │  Button, Dialog, Command, Skeleton, etc.   │                 │
│         └─────────────────────────────────────────────┘                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### UI Primitives (`src/components/ui/`)

> Shadcn/ui-based primitives with custom styling using class-variance-authority.

| Component | File | Key Props | Description |
|-----------|------|-----------|-------------|
| `Button` | `button.tsx` | `variant`, `size` | Primary action trigger with variants |
| `Carousel` | `carousel.tsx` | Embla options | Embla carousel wrapper components |
| `Command` | `command.tsx` | cmdk props | Command palette (search) components |
| `Dialog` | `dialog.tsx` | `open`, `onOpenChange` | Radix Dialog overlay |
| `Empty` | `empty.tsx` | `icon`, `title`, `description` | Empty state placeholder |
| `Field` | `field.tsx` | Form field wrapper |
| `Icons` | `icons.tsx` | - | Lucide icon exports (GitHub, Search, Menu, X) |
| `Item` | `item.tsx` | `variant`, `size` | List item component with variants |
| `Kbd` | `kbd.tsx` | - | Keyboard shortcut display |
| `Label` | `label.tsx` | - | Form label |
| `Separator` | `separator.tsx` | `orientation` | Radix Separator |
| `Skeleton` | `skeleton.tsx` | - | Loading skeleton |
| `Sonner` | `sonner.tsx` | - | Toast notifications |
| `Spinner` | `spinner.tsx` | `className` | Loading spinner |
| `Tabs` | `tabs.tsx` | - | Radix Tabs wrapper |
| `Textarea` | `textarea.tsx` | - | Text area input |

### Block Components (`src/components/blocks/`)

> Page-level sections and reusable composed components.

#### Navbar (`navbar.tsx`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  aniflix      Home  Browse  Schedule  Saved      [🔍 Search ⌘K]  [🐙]  │
└─────────────────────────────────────────────────────────────────────────┘
```

- Fixed position with blur backdrop
- Logo links to landing page
- Navigation links (hidden on mobile)
- Search button triggers `CommandMenu` via keyboard event
- GitHub link
- Mobile hamburger menu

#### Footer (`footer.tsx`)

- Brand with tagline
- Navigation columns: Explore, Legal, Connect
- Atmospheric gradient backdrop
- Copyright notice

#### Command Menu (`command-menu.tsx`)

- Global search accessible via `Cmd+K` / `Ctrl+K`
- Debounced search input (300ms)
- Results with poster thumbnails
- Keyboard navigation support
- Links to anime detail pages

#### Spotlight Carousel (`spotlight-carousel.tsx`)

- Embla carousel with fade transition
- 6-second autoplay interval
- Pauses on mouse enter
- Dot indicators for manual navigation
- Background poster with gradient overlays
- "Watch" and "Details" action buttons

---

## State Management

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────┐                                                        │
│   │  Component  │                                                        │
│   └──────┬──────┘                                                        │
│          │                                                               │
│          │ useQuery() / useQueryState() / useWatchProgress()             │
│          ▼                                                               │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         STATE LAYER                              │   │
│   ├─────────────────────────────────────────────────────────────────┤   │
│   │                                                                   │   │
│   │  ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│   │  │  TanStack Query  │  │    nuqs      │  │  localStorage    │   │   │
│   │  │  (Server State)  │  │ (URL State)  │  │  (Client State)  │   │   │
│   │  └────────┬─────────┘  └──────┬───────┘  └────────┬─────────┘   │   │
│   │           │                   │                   │              │   │
│   │           ▼                   ▼                   ▼              │   │
│   │  ┌──────────────────────────────────────────────────────────┐   │   │
│   │  │                   PERSISTENCE LAYER                       │   │   │
│   │  │   oRPC API   │   URL Params   │   LocalStorage           │   │   │
│   │  └──────────────────────────────────────────────────────────┘   │   │
│   │                                                                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### TanStack Query Client

```typescript
// src/lib/query/client.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // 1 minute cache before refetch
      retry: 1,              // Single retry on failure
    },
  },
});
```

### Watch Progress Store (`src/hooks/use-watch-progress.ts`)

**Storage Key:** `aniflix-watch-progress`

```typescript
interface WatchProgress {
  animeId: string;        // "one-piece-100"
  episodeNumber: number;  // 42
  currentTime: number;    // 845.23 (seconds)
  duration: number;       // 1440.0 (seconds)
  updatedAt: number;      // 1734451200000 (timestamp)
  poster?: string;        // For continue watching display
  name?: string;          // For continue watching display
}
```

**Key Functions:**

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getProgress` | `animeId`, `episodeNumber` | `WatchProgress \| null` | Get progress for specific episode |
| `saveProgress` | `animeId`, `episodeNumber`, `currentTime`, `duration`, `metadata?` | `void` | Save/update progress |
| `clearProgress` | `animeId`, `episodeNumber` | `void` | Remove episode progress |
| `getLastWatchedEpisode` | `animeId` | `WatchProgress \| null` | Get most recent for series |
| `getAllRecentlyWatched` | `limit?` | `WatchProgress[]` | Get all recent, sorted by time |

### Saved Series Store (`src/hooks/use-saved-series.ts`)

**Storage Key:** `aniflix-saved-series`

```typescript
interface SavedSeries {
  id: string;       // "one-piece-100"
  name: string;     // "One Piece"
  poster: string;   // "https://cdn.../poster.jpg"
  savedAt: number;  // 1734451200000 (timestamp)
}
```

**Key Functions:**

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `isSaved` | `id` | `boolean` | Check if anime is saved |
| `toggleSave` | `{ id, name, poster }` | `boolean` | Add/remove, returns true if saved |
| `removeSaved` | `id` | `void` | Remove specific series |

### Player Preferences Store (`src/hooks/use-player-preferences.ts`)

**Storage Key:** `aniflix-player-preferences`

```typescript
interface PlayerPreferences {
  playbackRate: number;         // Default: 1 (0.25 - 2.0)
  volume: number;               // Default: 1 (0.0 - 1.0)
  muted: boolean;               // Default: false
  captionLanguage: string | null;  // Default: null (first available)
  autoplay: boolean;            // Default: true
}
```

**Key Functions:**

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `updatePreferences` | `Partial<PlayerPreferences>` | `void` | Partial update |
| `setPlaybackRate` | `rate` | `void` | Update playback speed |
| `setVolume` | `volume`, `muted?` | `void` | Update volume settings |
| `setCaptionLanguage` | `language` | `void` | Update caption preference |
| `resetPreferences` | - | `void` | Reset to defaults |

---

## Data Flow & Logic

### Search Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SEARCH FLOW                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. User types in search input                                           │
│     └── State updates: setQuery(value)                                   │
│                                                                          │
│  2. useDebounce(query, 300ms)                                            │
│     └── Returns debouncedQuery after 300ms of inactivity                 │
│                                                                          │
│  3. TanStack Query (enabled when debouncedQuery.length >= 2)             │
│     └── orpc.anime.search.queryOptions({ query, page: 1 })               │
│         │                                                                │
│         └── POST /rpc ──▶ scraper.search() ──▶ HiAnime API               │
│                                                                          │
│  4. Results rendered in dropdown/command palette                         │
│     └── Click result ──▶ router.push(`/anime/${id}`)                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Video Playback Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        VIDEO PLAYBACK FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Watch page mounts                                                    │
│     ├── Fetch anime info (/rpc anime.getAboutInfo)                       │
│     ├── Fetch episodes (/rpc anime.getEpisodes)                          │
│     ├── Fetch servers (/rpc anime.getEpisodeServers)                     │
│     └── Fetch sources (/rpc anime.getEpisodeSources)                     │
│                                                                          │
│  2. Vidstack player receives HLS source                                  │
│     └── Source URL: /api/proxy?url=<hls-url>&headers=<json>              │
│                                                                          │
│  3. onCanPlay callback fires                                             │
│     ├── Restore playback rate from preferences                           │
│     ├── Restore volume/mute from preferences                             │
│     └── Restore watch position (if progress exists, > 5s, < 95%)         │
│                                                                          │
│  4. onTimeUpdate (throttled every 5 seconds)                             │
│     ├── If currentTime < 5s ──▶ Skip (too early)                         │
│     ├── If >= 95% OR remaining < 60s ──▶ Clear progress (completed)      │
│     └── Otherwise ──▶ Save progress to localStorage                      │
│                                                                          │
│  5. User preference changes                                              │
│     ├── onVolumeChange ──▶ Save volume preference                        │
│     ├── onRateChange ──▶ Save playback rate preference                   │
│     └── onTextTrackChange ──▶ Save caption language preference           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Save Series Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SAVE SERIES FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. User clicks "Save" button on anime detail page                       │
│     └── toggleSave({ id, name, poster })                                 │
│                                                                          │
│  2. Hook reads current localStorage state                                │
│     └── getStoredSeries() ──▶ JSON.parse(localStorage)                   │
│                                                                          │
│  3. Toggle logic                                                         │
│     ├── If exists ──▶ Filter out from array                              │
│     └── If new ──▶ Push with { ...series, savedAt: Date.now() }          │
│                                                                          │
│  4. Persist to localStorage                                              │
│     └── setStoredSeries(updated) ──▶ JSON.stringify to localStorage      │
│                                                                          │
│  5. Emit change to all listeners                                         │
│     └── emitChange() ──▶ All useSyncExternalStore hooks re-render        │
│                                                                          │
│  6. Toast notification displayed                                         │
│     └── toast("Added to saved") or toast("Removed from saved")           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Integration

### oRPC Router (`src/lib/orpc/router.ts`)

```typescript
export const appRouter = {
  anime: {
    getHomePage,           // () -> ScrapedHomePage
    getAZList,             // (letter, page) -> anime list
    getAboutInfo,          // (id) -> ScrapedAnimeAboutInfo
    search,                // (query, page, filters?) -> ScrapedAnimeSearchResult
    getEpisodes,           // (id) -> ScrapedAnimeEpisodes
    getEpisodeServers,     // (episodeId) -> ScrapedEpisodeServers
    getEpisodeSources,     // (episodeId, server, category) -> sources + tracks
    getCategoryAnime,      // (category, page) -> ScrapedAnimeCategory
    getEstimatedSchedule,  // (date) -> ScrapedEstimatedSchedule
    getGenreAnime,         // (genre, page) -> ScrapedGenreAnime
  },
};
```

### API Endpoints

| Procedure | Input | Returns | Description |
|-----------|-------|---------|-------------|
| `getHomePage` | - | `ScrapedHomePage` | Spotlight, trending, latest, top airing |
| `getAZList` | `letter`, `page` | Anime list | Alphabetical browsing |
| `getAboutInfo` | `id` | `ScrapedAnimeAboutInfo` | Full anime details + related |
| `search` | `query`, `page`, `filters?` | `ScrapedAnimeSearchResult` | Search with filters |
| `getEpisodes` | `id` | `ScrapedAnimeEpisodes` | Episode list with IDs |
| `getEpisodeServers` | `episodeId` | `ScrapedEpisodeServers` | Available servers (sub/dub) |
| `getEpisodeSources` | `episodeId`, `server`, `category` | Sources + tracks | HLS URLs, subtitles |
| `getCategoryAnime` | `category`, `page` | `ScrapedAnimeCategory` | Category browsing |
| `getEstimatedSchedule` | `date` | `ScrapedEstimatedSchedule` | Daily release schedule |
| `getGenreAnime` | `genre`, `page` | `ScrapedGenreAnime` | Genre-based browsing |

### Proxy API (`/api/proxy`)

**Edge Runtime** handler for video streams, subtitles, and images.

**Features:**
- CORS handling with origin whitelist
- M3U8 manifest URL rewriting (proxies all segments)
- VTT subtitle/thumbnail URL rewriting
- Range request support for video seeking
- Custom header forwarding (Referer, Origin)

**URL Format:**
```
/api/proxy?url=<encoded-url>&headers=<encoded-json-headers>
```

**Default Headers:**
```typescript
{
  Referer: "https://megacloud.blog/",
  Origin: "https://megacloud.blog",
}
```

---

## PWA Support

The application supports Progressive Web App installation:

**Manifest (`src/app/manifest.ts`):**

| Property | Value |
|----------|-------|
| Name | "Anirohi - Stream Anime Free" |
| Short Name | "Anirohi" |
| Display | standalone |
| Background Color | #0a0a0a |
| Theme Color | #06b6d4 (cyan) |
| Icons | 192x192, 512x512 PNG |

**Capabilities:**
- Install to home screen
- Standalone app experience
- Apple Web App support with `black-translucent` status bar
