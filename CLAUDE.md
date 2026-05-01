# GymRoster UI

Frontend for the GymRoster application. Displays college women's gymnastics data: athletes, college programs, coaches, and meet scores.

## Backend

- Java Spring Boot API — source at `/Users/evie/Development/gym-roster`
- API base URL configured via `NEXT_PUBLIC_GYMROSTER_API_BASE_URL` in `.env.local`

### API Endpoints and Response Shapes

| Resource         | Endpoint                      | Notes                       |
| ---------------- | ----------------------------- | --------------------------- |
| Athletes (list)  | `GET /athlete?page=0&size=10` | Spring HATEOAS `PagedModel` |
| Athlete (detail) | `GET /athlete/:id`            | —                           |
| Colleges (list)  | `GET /college?page=0&size=10` | Spring `Page<T>`            |
| College (detail) | `GET /college/:id`            | —                           |
| Coaches (list)   | `GET /coach?page=0&size=10`   | Spring `Page<T>`            |
| Coach (detail)   | `GET /coach/:id`              | —                           |

> **Important:** The athlete list uses Spring HATEOAS (`PagedModel`). Its JSON shape has `_embedded.content` for the items array and a `page` object for pagination metadata. The college and coach lists use plain Spring `Page<T>`, which puts `content` at the root alongside `totalPages`, `totalElements`, `size`, and `number`.

Roster and meet data is currently import-only (no GET list endpoints).

### Domain Field Reference

**Athlete**: `id`, `firstName`, `lastName`, `homeCity`, `homeState` (State enum code e.g. `"NY"`), `homeCountry` (Country enum code e.g. `"USA"`), `clubName`

**College**: `id`, `codeName`, `shortName`, `longName`, `city`, `state`, `conference` (enum: ACC, BIG12, BIGTEN, EAGL, GEC, IND, MAC, MIC, MPSF, MW, NCGAEAST, PAC12, SEC, WIAC), `division` (enum: DIV1, DIV2, DIV3), `region` (enum: C, NC, NE, SC, SE, W, NA), `nickname`, `teamUrl`

**Coach**: `id`, `firstName`, `lastName`

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Material UI v6** (`@mui/material`) — no Tailwind or CSS modules
- **pnpm** (enforced — do not use npm or yarn)
- **Vitest** + **@testing-library/react** + **MSW v2** for tests

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout — imports ThemeRegistry and Header
    page.tsx                # Home page
    athletes/
      layout.tsx
      page.tsx              # Athletes list (paginated)
      [id]/page.tsx         # Athlete detail
  components/
    Header/index.tsx        # MUI AppBar navigation
    Pagination/index.tsx    # MUI Pagination wrapper
    ThemeRegistry/index.tsx # MUI ThemeProvider + CssBaseline ('use client')
  lib/
    definitions.ts          # Shared TypeScript types for API responses
  __mocks__/
    handlers.ts             # MSW request handlers
    server.ts               # MSW server setup
  __tests__/
    setup.ts                # Vitest global setup
```

## Coding Conventions

- Pages are `'use client'` components that fetch with `useEffect` + `useState`
- Pagination state is 1-indexed; subtract 1 when passing `page` to the API (`?page=${page - 1}`)
- All shared TypeScript types live in `src/lib/definitions.ts`
- New components go in `src/components/<Name>/index.tsx`
- MUI: use named imports from `@mui/material` (e.g. `import { Table, TableHead } from '@mui/material'`)
- New API mock handlers go in `src/__mocks__/handlers.ts` — follow the existing MSW v2 pattern
