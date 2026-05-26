import { useEffect, useState } from 'react';
import { fetchStaffRoles } from '@/lib/api/reference';
import { ReferenceItem } from '@/lib/definitions';

type UseStaffRolesResult = {
  staffRoles: ReferenceItem[];
  loading: boolean;
  error: string | null;
};

export function useStaffRoles(): UseStaffRolesResult {
  const [staffRoles, setStaffRoles] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStaffRoles();
        if (!cancelled) setStaffRoles(data);
      } catch {
        if (!cancelled) setError('Failed to load staff roles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { staffRoles, loading, error };
}
