import { useCallback, useEffect, useState } from 'react';
import { fetchAthlete } from '@/lib/api/athletes';
import { Athlete } from '@/lib/definitions';

type UseAthleteResult = {
  athlete: Athlete | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useAthlete(id: string): UseAthleteResult {
  const [refreshKey, setRefreshKey] = useState(0);
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAthlete(id);
        if (!cancelled) {
          setAthlete(data);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load athlete details');
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
  }, [id, refreshKey]);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  return { athlete, loading, error, refresh };
}
