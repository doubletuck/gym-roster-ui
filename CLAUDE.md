# GymRoster UI

Frontend for the GymRoster application. Displays college women's gymnastics data: athletes, college programs, coaches, and meet scores.

## Backend

- Java Spring Boot API — source at `/Users/evie/Development/gym-roster`
- API base URL configured via `NEXT_PUBLIC_GYMROSTER_API_BASE_URL` in `.env.local`

### API Endpoints and Response Shapes

| Resource         | Endpoint                                                           | Notes                       |
| ---------------- | ------------------------------------------------------------------ | --------------------------- |
| Athletes (list)  | `GET /athlete?page=0&size=30&sort=lastName,asc&sort=firstName,asc` | Spring HATEOAS `PagedModel` |
| Athlete (detail) | `GET /athlete/:id`                                                 | —                           |
| Colleges (list)  | `GET /college?page=0&size=10`                                      | Spring `Page<T>`            |
| College (detail) | `GET /college/:id`                                                 | —                           |
| Coaches (list)   | `GET /coach?page=0&size=10`                                        | Spring `Page<T>`            |
| Coach (detail)   | `GET /coach/:id`                                                   | —                           |

> **Important:** The athlete list uses Spring HATEOAS (`PagedModel`). Its JSON shape has `_embedded.content` for the items array and a `page` object for pagination metadata. The college and coach lists use plain Spring `Page<T>`, which puts `content` at the root alongside `totalPages`, `totalElements`, `size`, and `number`.

The athlete list endpoint supports optional filter query params: `firstName`, `lastName`, `homeCity`, `homeState`, `homeCountry`, `clubName`, `collegeCodeName`, `seasonYear`, `academicYear`. See the backend API docs at `/Users/evie/Development/gym-roster/docs/api/api-athlete.md` for full details.

Both athlete endpoints return `AthleteDto`, which includes a `rosters` array of `AthleteRoster` objects. Meet data is currently import-only (no GET endpoints).

### Domain Field Reference

**Athlete** (`AthleteDto`): `id`, `firstName`, `lastName`, `homeCity`, `homeState` (State code e.g. `"NY"`), `homeCountry` (Country code e.g. `"USA"`), `clubName`, `creationTimestamp`, `lastUpdateTimestamp`, `rosters` (array of `AthleteRoster`)

**AthleteRoster**: `collegeCodeName`, `collegeShortName`, `collegeLongName`, `seasonYear` (number), `academicYear` (e.g. `"FR"`, `"SO"`, `"JR"`, `"SR"`)

**College**: `id`, `codeName`, `shortName`, `longName`, `city`, `state`, `conference` (enum: ACC, BIG12, BIGTEN, EAGL, GEC, IND, MAC, MIC, MPSF, MW, NCGAEAST, PAC12, SEC, WIAC), `division` (enum: DIV1, DIV2, DIV3), `region` (enum: C, NC, NE, SC, SE, W, NA), `nickname`, `teamUrl`

**Coach**: `id`, `firstName`, `lastName`

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Material UI v9** (`@mui/material`) + **`@mui/material-nextjs`** for App Router SSR support — no Tailwind or CSS modules
- **pnpm** (enforced — do not use npm or yarn)
- **Vitest** + **@testing-library/react** + **MSW v2** for tests

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout — AppRouterCacheProvider > ThemeRegistry > Header
    page.tsx                # Home page
    athletes/
      layout.tsx
      page.tsx              # Athletes list (paginated, sorted by lastName/firstName)
      page.test.tsx         # Athletes list tests
      [id]/page.tsx         # Athlete detail (includes roster history)
      [id]/page.test.tsx    # Athlete detail tests
  components/
    Header/index.tsx        # MUI AppBar navigation
    Pagination/index.tsx    # MUI Pagination wrapper
    ThemeRegistry/index.tsx # MUI ThemeProvider + CssBaseline ('use client')
  lib/
    api/
      athletes.ts           # Fetch functions for athlete endpoints (pure async, no React)
    hooks/
      useAthlete.ts         # Hook wrapping fetchAthlete — returns { athlete, loading, error }
      useAthletes.ts        # Hook wrapping fetchAthletes — returns { athletes, totalPages, loading, error }
    definitions.ts          # Shared TypeScript types for API responses
test/
  fixtures/
    handlers.ts             # MSW request handlers
    mock-data.ts            # Reusable mock data objects
    server.ts               # MSW server setup
  setup.ts                  # Vitest global setup (server lifecycle hooks)
```

## Coding Conventions

- Pages are `'use client'` components; data fetching goes through hooks in `src/lib/hooks/`
- Fetch functions in `src/lib/api/` are plain async functions (no React); hooks wrap them with `useState`/`useEffect`
- New resources follow the same pattern: create `src/lib/api/<resource>.ts`, `src/lib/hooks/use<Resource>.ts`, then the page
- Pagination state is 1-indexed in the UI; hooks subtract 1 before passing `page` to the API
- All shared TypeScript types live in `src/lib/definitions.ts`
- New components go in `src/components/<Name>/index.tsx`
- MUI: use named imports from `@mui/material` (e.g. `import { Table, TableHead } from '@mui/material'`)
- Tests are co-located with their page (e.g. `app/athletes/page.test.tsx`); new MSW handlers go in `test/fixtures/handlers.ts`
- Each page should handle loading, error, and empty states

## Keep Documentation Updated

Documentation should be updated to reflect any changes that occurred in the code.
