import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@test/fixtures/server';
import { resetStaffRolesCache } from '@/lib/api/reference';
import CoachDetail from './page';

let mockPush: ReturnType<typeof vi.fn>;

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: mockPush }),
}));

describe('Coach Detail Page', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL = 'http://localhost:3000';
    mockPush = vi.fn();
    resetStaffRolesCache();
  });

  it('should fetch and display coach details', async () => {
    render(<CoachDetail />);

    await waitFor(() => {
      expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    });
  });

  it('should display loading state initially', async () => {
    render(<CoachDetail />);

    expect(screen.getByText('Loading coach details...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading coach details...')).not.toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    server.use(http.get('http://localhost:3000/coach/:id', () => HttpResponse.error()));

    render(<CoachDetail />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load coach details')).toBeInTheDocument();
    });
  });

  it('should display roster history sorted by season year descending', async () => {
    render(<CoachDetail />);

    await waitFor(() => {
      expect(screen.getByText('Roster History')).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    // rows[0] is the header; rows[1] and rows[2] are data rows
    expect(rows[1]).toHaveTextContent('2024');
    expect(rows[1]).toHaveTextContent('Head Coach');
    expect(rows[2]).toHaveTextContent('2023');
    expect(rows[2]).toHaveTextContent('Assistant Coach');
  });

  describe('edit mode', () => {
    it('should show edit form when Edit button is clicked', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByLabelText(/first name/i)).toHaveValue('Alex');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Rivera');
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should exit edit mode when Cancel is clicked', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should show delete buttons on roster rows in edit mode', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const deleteButtons = screen.getAllByRole('button', { name: /delete roster entry/i });
      expect(deleteButtons).toHaveLength(2);
    });

    it('should show Add Roster Entry form in edit mode', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByText('Add Roster Entry')).toBeInTheDocument();
      expect(screen.getByLabelText(/season year/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument();
    });

    it('should call PUT /coach/:id and show success when Save is clicked', async () => {
      let putCalled = false;
      server.use(
        http.put('http://localhost:3000/coach/1', async ({ request }) => {
          putCalled = true;
          const body = await request.json();
          expect(body).toMatchObject({ firstName: 'Alexandra', lastName: 'Rivera' });
          return HttpResponse.json({ coachId: '1' });
        })
      );

      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'Alexandra' } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(putCalled).toBe(true);
      });

      await waitFor(() => {
        expect(screen.getByText('Coach saved successfully')).toBeInTheDocument();
      });
    });

    it('should show error snackbar when required fields are empty on save', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: '' } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(screen.getByText('First name and last name are required')).toBeInTheDocument();
      });
    });

    it('should call DELETE /roster/coach/:id and show success when delete is clicked', async () => {
      let deletedId: string | undefined;
      server.use(
        http.delete('http://localhost:3000/roster/coach/:id', ({ params }) => {
          deletedId = params.id as string;
          return new HttpResponse(null, { status: 204 });
        })
      );

      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
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
      server.use(http.delete('http://localhost:3000/roster/coach/:id', () => HttpResponse.error()));

      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      const deleteButtons = screen.getAllByRole('button', { name: /delete roster entry/i });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to remove roster entry')).toBeInTheDocument();
      });
    });
  });

  describe('delete coach', () => {
    it('should show Delete button in view mode', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
    });

    it('should open confirmation dialog when Delete is clicked', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/are you sure you want to delete alex rivera/i)).toBeInTheDocument();
    });

    it('should close dialog without deleting when Cancel is clicked', async () => {
      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
      await screen.findByRole('dialog');

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should call DELETE /coach/:id and navigate to /coaches on confirm', async () => {
      let deleteCalled = false;
      server.use(
        http.delete('http://localhost:3000/coach/:id', () => {
          deleteCalled = true;
          return new HttpResponse(null, { status: 204 });
        })
      );

      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
      const dialog = await screen.findByRole('dialog');
      fireEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(deleteCalled).toBe(true);
        expect(mockPush).toHaveBeenCalledWith('/coaches');
      });
    });

    it('should show error snackbar when delete fails', async () => {
      server.use(http.delete('http://localhost:3000/coach/:id', () => HttpResponse.error()));

      render(<CoachDetail />);

      await waitFor(() => {
        expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
      const dialog = await screen.findByRole('dialog');
      fireEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(screen.getByText('Failed to delete coach')).toBeInTheDocument();
      });
    });
  });
});
