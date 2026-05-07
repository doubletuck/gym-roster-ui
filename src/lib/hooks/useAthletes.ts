import { useEffect, useState } from 'react';
import { fetchAthletes, AthleteFilters } from '@/lib/api/athletes';
import { Athlete } from '@/lib/definitions';

type UseAthletesResult = {
  athletes: Athlete[];
  totalPages: number;
  loading: boolean;
  error: string | null;
};

export function useAthletes(
  page: number,
  size: number,
  filters: AthleteFilters = {},
  enabled: boolean = true
): UseAthletesResult {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAthletes(page - 1, size, filters);
        if (!cancelled) {
          setAthletes(data._embedded?.content ?? []);
          setTotalPages(data.page.totalPages);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load athletes');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page, size, enabled, filters.q, filters.seasonYear]); // eslint-disable-line react-hooks/exhaustive-deps

  return { athletes, totalPages, loading, error };
}
