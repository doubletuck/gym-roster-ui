import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/__mocks__/server';
import AthleteDetail from '@/app/athletes/[id]/page';

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
});
