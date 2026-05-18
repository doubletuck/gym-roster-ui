import { Athlete, AthleteUpdateRequest, PaginatedResponse } from '@/lib/definitions';

export type AthleteFilters = {
  q?: string;
  seasonYear?: number;
};

export async function fetchAthletes(
  page: number,
  size: number,
  filters: AthleteFilters = {}
): Promise<PaginatedResponse<Athlete>> {
  let url = `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/athlete?page=${page}&size=${size}&sort=lastName,asc&sort=firstName,asc`;
  if (filters.q) url += `&q=${encodeURIComponent(filters.q)}`;
  if (filters.seasonYear != null) url += `&seasonYear=${filters.seasonYear}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch athletes');
  }
  return response.json();
}

export async function fetchAthlete(id: string): Promise<Athlete> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/athlete/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch athlete');
  }
  return response.json();
}

export async function updateAthlete(id: string, data: AthleteUpdateRequest): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/athlete/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update athlete');
  }
}

export async function deleteAthlete(id: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/athlete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete athlete');
  }
}
