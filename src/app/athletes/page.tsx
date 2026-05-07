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
import { useAthletes } from '@/lib/hooks/useAthletes';

const PAGE_SIZE = 30;

function AthletesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qParam = searchParams.get('q') ?? '';
  const seasonYearParam = searchParams.get('seasonYear') ?? '';
  const pageParam = searchParams.get('page');
  const hasSearched = pageParam !== null;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [q, setQ] = useState(qParam);
  const [seasonYear, setSeasonYear] = useState(seasonYearParam);

  // Sync form fields when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setQ(qParam);
    setSeasonYear(seasonYearParam);
  }, [qParam, seasonYearParam]);

  const { athletes, totalPages, loading, error } = useAthletes(
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
    router.push(`/athletes?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.replace(`/athletes?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Athletes
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <TextField
            label="Search"
            placeholder="Name, club, or college"
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
          Enter search criteria and click Search to find athletes.
        </Typography>
      )}
      {hasSearched && loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Loading athletes...</Typography>
        </Box>
      )}
      {hasSearched && !loading && error && <Typography color="error">{error}</Typography>}
      {hasSearched && !loading && !error && athletes.length === 0 && (
        <Typography>No athletes found.</Typography>
      )}
      {hasSearched && !loading && !error && athletes.length > 0 && (
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
                <TableCell>Home Location</TableCell>
                <TableCell>Home Country</TableCell>
                <TableCell>College Team(s)</TableCell>
                <TableCell>Club Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {athletes.map(athlete => (
                <TableRow key={athlete.id} hover>
                  <TableCell>
                    <MuiLink component={Link} href={`/athletes/${athlete.id}`} underline="hover">
                      {athlete.firstName} {athlete.lastName}
                    </MuiLink>
                  </TableCell>
                  <TableCell>
                    {athlete.homeCity}
                    {athlete.homeState ? `, ${athlete.homeState}` : ''}
                  </TableCell>
                  <TableCell>{athlete.homeCountry}</TableCell>
                  <TableCell>
                    {[
                      ...new Map(
                        athlete.rosters.map(r => [r.collegeCodeName, r.collegeShortName])
                      ).values(),
                    ].join(', ')}
                  </TableCell>
                  <TableCell>{athlete.clubName}</TableCell>
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
      <AthletesPage />
    </Suspense>
  );
}
