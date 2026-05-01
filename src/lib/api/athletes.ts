import { Athlete, PaginatedResponse } from '@/lib/definitions';

export async function fetchAthletes(
  page: number,
  size: number
): Promise<PaginatedResponse<Athlete>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/athlete?page=${page}&size=${size}`
  );
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
