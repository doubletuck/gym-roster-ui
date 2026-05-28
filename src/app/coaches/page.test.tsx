import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { useRouter, useSearchParams } from 'next/navigation';
import { server } from '@test/fixtures/server';
import Page from './page';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('Coaches Page', () => {
  let mockPush: ReturnType<typeof vi.fn>;
  let mockReplace: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL = 'http://localhost:3000';
    mockPush = vi.fn();
    mockReplace = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush, replace: mockReplace } as any);
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as any);
  });

  it('should show empty state before search is submitted', () => {
    render(<Page />);

    expect(screen.getByText(/enter search criteria and click search/i)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading coaches...')).not.toBeInTheDocument();
  });

  it('should show results after search is submitted', async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('page=1') as any);

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/Alex/)).toBeInTheDocument();
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(/Sam/)).toBeInTheDocument();
  });

  it('should display loading state during fetch', async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('page=1') as any);

    render(<Page />);

    expect(screen.getByText('Loading coaches...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading coaches...')).not.toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('page=1') as any);
    server.use(http.get('http://localhost:3000/coach', () => HttpResponse.error()));

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load coaches')).toBeInTheDocument();
    });
  });

  it('should display coaches table with correct columns', async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('page=1') as any);

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/Alex/)).toBeInTheDocument();
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('College Team(s)')).toBeInTheDocument();
    expect(screen.getByText('UCLA')).toBeInTheDocument();
    expect(screen.getByText('NYU')).toBeInTheDocument();
  });

  it('should navigate with q param when search button is clicked', () => {
    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText('Name or college'), {
      target: { value: 'rivera' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockPush).toHaveBeenCalledWith('/coaches?q=rivera&page=1');
  });

  it('should navigate with only page param when searching with empty fields', () => {
    render(<Page />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockPush).toHaveBeenCalledWith('/coaches?page=1');
  });

  it('should navigate with seasonYear param when provided', () => {
    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText('e.g. 2024'), {
      target: { value: '2024' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockPush).toHaveBeenCalledWith('/coaches?seasonYear=2024&page=1');
  });

  describe('Add Coach', () => {
    it('should always show Add Coach button', () => {
      render(<Page />);

      expect(screen.getByRole('button', { name: /add coach/i })).toBeInTheDocument();
    });

    it('should open dialog when Add Coach is clicked', () => {
      render(<Page />);

      fireEvent.click(screen.getByRole('button', { name: /add coach/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    });

    it('should close dialog when Cancel is clicked', async () => {
      render(<Page />);

      fireEvent.click(screen.getByRole('button', { name: /add coach/i }));
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      // MUI Dialog uses a CSS transition on exit; wait for it to fully unmount
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show validation error when fields are empty', async () => {
      render(<Page />);

      fireEvent.click(screen.getByRole('button', { name: /add coach/i }));
      fireEvent.click(screen.getByRole('button', { name: /^add$/i }));

      await waitFor(() => {
        expect(screen.getByText('First name and last name are required')).toBeInTheDocument();
      });
    });

    it('should call POST /coach and navigate to new coach on success', async () => {
      let postBody: unknown;
      server.use(
        http.post('http://localhost:3000/coach', async ({ request }) => {
          postBody = await request.json();
          return HttpResponse.json(
            { id: 10, firstName: 'Jane', lastName: 'Smith' },
            { status: 201 }
          );
        })
      );

      render(<Page />);

      fireEvent.click(screen.getByRole('button', { name: /add coach/i }));
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } });
      fireEvent.click(screen.getByRole('button', { name: /^add$/i }));

      await waitFor(() => {
        expect(postBody).toMatchObject({ firstName: 'Jane', lastName: 'Smith' });
        expect(mockPush).toHaveBeenCalledWith('/coaches/10');
      });
    });

    it('should show error when POST /coach fails', async () => {
      server.use(http.post('http://localhost:3000/coach', () => HttpResponse.error()));

      render(<Page />);

      fireEvent.click(screen.getByRole('button', { name: /add coach/i }));
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } });
      fireEvent.click(screen.getByRole('button', { name: /^add$/i }));

      await waitFor(() => {
        expect(screen.getByText('Failed to create coach')).toBeInTheDocument();
      });
    });
  });
});
