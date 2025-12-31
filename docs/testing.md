# Testing Setup

This project uses **Vitest** with **MSW (Mock Service Worker)** for testing React components and API interactions.

## Running Tests

```bash
# Run tests once
pnpm test -- --run

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui
```

## Project Structure

- `src/__tests__/` - Test files
  - `setup.ts` - Vitest setup file with MSW server configuration
  - `athletes.test.tsx` - Example test for the Athletes page
- `src/__mocks__/` - Mock definitions
  - `handlers.ts` - MSW request handlers for API endpoints
  - `server.ts` - MSW server setup

## Example: Athletes API Test

The `athletes.test.tsx` file demonstrates how to:

1. **Mock API calls with MSW** - The handlers intercept fetch requests to `/athlete` endpoint
2. **Test async data loading** - Uses `waitFor` to wait for data to load
3. **Verify component rendering** - Checks that athletes are displayed in the table
4. **Test loading states** - Validates loading messages and state changes

### Key Points

- MSW automatically intercepts all fetch calls matching the handlers
- Tests use `@testing-library/react` for component testing
- `@testing-library/jest-dom` provides additional matchers like `.toBeInTheDocument()`
- Environment variables (like `NEXT_PUBLIC_GYMROSTER_API_BASE_URL`) can be set in tests

## Configuration Files

- `vitest.config.ts` - Vitest configuration with jsdom environment and React plugin
- `src/__tests__/setup.ts` - Global test setup with MSW server lifecycle hooks
