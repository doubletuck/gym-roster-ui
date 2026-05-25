'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { useCoaches } from '@/lib/hooks/useCoaches';

const PAGE_SIZE = 10;

function CoachesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qParam = searchParams.get('q') ?? '';
  const seasonYearParam = searchParams.get('seasonYear') ?? '';
  const pageParam = searchParams.get('page');
  const hasSearched = pageParam !== null;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [q, setQ] = useState(qParam);
  const [seasonYear, setSeasonYear] = useState(seasonYearParam);

  useEffect(() => {
    setQ(qParam);
    setSeasonYear(seasonYearParam);
  }, [qParam, seasonYearParam]);

  const { coaches, totalPages, loading, error } = useCoaches(
    currentPage,
    PAGE_SIZE,
    {
      q: qParam || undefined,
      seasonYear: seasonYearParam ? parseInt(seasonYearParam, 10) : undefined,
    },
    hasSearched
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (seasonYear.trim()) params.set('seasonYear', seasonYear.trim());
    params.set('page', '1');
    router.push(`/coaches?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.replace(`/coaches?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Coaches
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <TextField
            label="Search"
            placeholder="Name or college"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <TextField
            label="Season Year"
            placeholder="e.g. 2024"
            value={seasonYear}
            onChange={e => setSeasonYear(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]*' } }}
            sx={{ width: 140 }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
      </Paper>

      {!hasSearched && (
        <Typography color="text.secondary">
          Enter search criteria and click Search to find coaches.
        </Typography>
      )}
      {hasSearched && loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Loading coaches...</Typography>
        </Box>
      )}
      {hasSearched && !loading && error && <Typography color="error">{error}</Typography>}
      {hasSearched && !loading && !error && coaches.length === 0 && (
        <Typography>No coaches found.</Typography>
      )}
      {hasSearched && !loading && !error && coaches.length > 0 && (
        <>
          <Box sx={{ mb: 2 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>College Team(s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coaches.map(coach => (
                <TableRow key={coach.coachId} hover>
                  <TableCell>
                    <MuiLink component={Link} href={`/coaches/${coach.coachId}`} underline="hover">
                      {coach.firstName} {coach.lastName}
                    </MuiLink>
                  </TableCell>
                  <TableCell>
                    {[
                      ...new Map(
                        coach.rosters.map(r => [r.collegeCodeName, r.collegeShortName])
                      ).values(),
                    ].join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <Box sx={{ p: 3 }}>
          <CircularProgress />
        </Box>
      }
    >
      <CoachesPage />
    </Suspense>
  );
}
