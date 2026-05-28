import { Coach, CoachUpdateRequest, PaginatedResponse } from '@/lib/definitions';

export type CoachFilters = {
  q?: string;
  seasonYear?: number;
};

export async function fetchCoaches(
  page: number,
  size: number,
  filters: CoachFilters = {}
): Promise<PaginatedResponse<Coach>> {
  let url = `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/coach?page=${page}&size=${size}&sort=lastName,asc&sort=firstName,asc`;
  if (filters.q) url += `&q=${encodeURIComponent(filters.q)}`;
  if (filters.seasonYear != null) url += `&seasonYear=${filters.seasonYear}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch coaches');
  }
  return response.json();
}

export async function fetchCoach(id: string): Promise<Coach> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/coach/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch coach');
  }
  return response.json();
}

export async function createCoach(data: CoachUpdateRequest): Promise<{ id: number }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/coach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create coach');
  }
  return response.json();
}

export async function updateCoach(id: string, data: CoachUpdateRequest): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/coach/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update coach');
  }
}

export async function deleteCoach(id: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/coach/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete coach');
  }
}
