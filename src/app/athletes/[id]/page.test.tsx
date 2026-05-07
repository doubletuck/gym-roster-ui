import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@test/fixtures/server';
import AthleteDetail from './page';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

describe('Athlete Detail Page', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL = 'http://localhost:3000';
  });

  it('should fetch and display athlete details', async () => {
    render(<AthleteDetail />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
    expect(screen.getByText('NYC Gym')).toBeInTheDocument();
  });

  it('should display loading state initially', async () => {
    render(<AthleteDetail />);

    expect(screen.getByText('Loading athlete details...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading athlete details...')).not.toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    server.use(http.get('http://localhost:3000/athlete/:id', () => HttpResponse.error()));

    render(<AthleteDetail />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load athlete details')).toBeInTheDocument();
    });
  });

  it('should display roster history sorted by season year descending', async () => {
    render(<AthleteDetail />);

    await waitFor(() => {
      expect(screen.getByText('Roster History')).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    // rows[0] is the header; rows[1] and rows[2] are data rows
    expect(rows[1]).toHaveTextContent('2024');
    expect(rows[1]).toHaveTextContent('SO');
    expect(rows[2]).toHaveTextContent('2023');
    expect(rows[2]).toHaveTextContent('FR');
  });
});
