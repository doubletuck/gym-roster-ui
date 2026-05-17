import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
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

  describe('edit mode', () => {
    it('should show edit form when Edit button is clicked', async () => {
      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/home city/i)).toHaveValue('New York');
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should exit edit mode when Cancel is clicked', async () => {
      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should show delete buttons on roster rows in edit mode', async () => {
      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const deleteButtons = screen.getAllByRole('button', { name: /delete roster entry/i });
      expect(deleteButtons).toHaveLength(2);
    });

    it('should show Add Roster Entry form in edit mode', async () => {
      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByText('Add Roster Entry')).toBeInTheDocument();
      expect(screen.getByLabelText(/season year/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument();
    });

    it('should call PUT /athlete/:id and show success when Save is clicked', async () => {
      let putCalled = false;
      server.use(
        http.put('http://localhost:3000/athlete/1', async ({ request }) => {
          putCalled = true;
          const body = await request.json();
          expect(body).toMatchObject({ firstName: 'Jane', lastName: 'Doe', homeCity: 'New York' });
          return HttpResponse.json({ id: '1' });
        })
      );

      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(putCalled).toBe(true);
      });

      await waitFor(() => {
        expect(screen.getByText('Athlete saved successfully')).toBeInTheDocument();
      });
    });

    it('should show error snackbar when required fields are empty on save', async () => {
      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: '' } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(
          screen.getByText('First name, last name, and home city are required')
        ).toBeInTheDocument();
      });
    });

    it('should call DELETE /roster/athlete/:id and show success when delete is clicked', async () => {
      let deletedId: string | undefined;
      server.use(
        http.delete('http://localhost:3000/roster/athlete/:id', ({ params }) => {
          deletedId = params.id as string;
          return new HttpResponse(null, { status: 204 });
        })
      );

      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const deleteButtons = screen.getAllByRole('button', { name: /delete roster entry/i });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(deletedId).toBeDefined();
      });

      await waitFor(() => {
        expect(screen.getByText('Roster entry removed')).toBeInTheDocument();
      });
    });

    it('should show error snackbar when roster delete fails', async () => {
      server.use(
        http.delete('http://localhost:3000/roster/athlete/:id', () => HttpResponse.error())
      );

      render(<AthleteDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const deleteButtons = screen.getAllByRole('button', { name: /delete roster entry/i });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to remove roster entry')).toBeInTheDocument();
      });
    });
  });
});
