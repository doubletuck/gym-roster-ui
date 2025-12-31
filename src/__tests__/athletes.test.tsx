import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Page from '@/app/athletes/page';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Athletes Page', () => {
  beforeEach(() => {
    // Set environment variable for test
    process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL = 'http://localhost:3000';
  });

  it('should fetch and display athletes', async () => {
    render(<Page />);

    // Wait for athletes to be displayed
    // Using regex to match partial text since names can be split across elements
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

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading athletes...')).not.toBeInTheDocument();
    });
  });

  it('should display athletes table with correct columns', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/John/)).toBeInTheDocument();
    });

    // Verify table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Verify table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Home Location')).toBeInTheDocument();
    expect(screen.getByText('Home Country')).toBeInTheDocument();
    expect(screen.getByText('Club Name')).toBeInTheDocument();
  });
});
