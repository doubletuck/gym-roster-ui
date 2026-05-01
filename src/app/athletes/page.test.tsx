import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@test/fixtures/server';
import Page from './page';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Athletes Page', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL = 'http://localhost:3000';
  });

  it('should fetch and display athletes', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/John/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Jane/)).toBeInTheDocument();
    expect(screen.getByText(/Smith/)).toBeInTheDocument();
  });

  it('should display loading state initially', async () => {
    render(<Page />);

    expect(screen.getByText('Loading athletes...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading athletes...')).not.toBeInTheDocument();
    });
  });

  it('should display athletes table with correct columns', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/John/)).toBeInTheDocument();
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Home Location')).toBeInTheDocument();
    expect(screen.getByText('Home Country')).toBeInTheDocument();
    expect(screen.getByText('Club Name')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    server.use(http.get('http://localhost:3000/athlete', () => HttpResponse.error()));

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load athletes')).toBeInTheDocument();
    });
  });
});
