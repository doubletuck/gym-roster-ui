import { AthleteRosterRequest } from '@/lib/definitions';

export async function createRosterEntry(data: AthleteRosterRequest): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/roster/athlete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create roster entry');
  }
}

export async function deleteRosterEntry(id: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/roster/athlete/${id}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error('Failed to delete roster entry');
  }
}
