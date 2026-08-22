'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
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
import { createCoach } from '@/lib/api/coaches';
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

  // Reset form fields when the URL changes externally (e.g. browser back/forward).
  const [prevQParam, setPrevQParam] = useState(qParam);
  const [prevSeasonYearParam, setPrevSeasonYearParam] = useState(seasonYearParam);
  if (qParam !== prevQParam || seasonYearParam !== prevSeasonYearParam) {
    setPrevQParam(qParam);
    setPrevSeasonYearParam(seasonYearParam);
    setQ(qParam);
    setSeasonYear(seasonYearParam);
  }

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '' });
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

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

  const handleOpenAddDialog = () => {
    setAddForm({ firstName: '', lastName: '' });
    setAddError(null);
    setAddDialogOpen(true);
  };

  const handleAddCoach = async () => {
    if (!addForm.firstName.trim() || !addForm.lastName.trim()) {
      setAddError('First name and last name are required');
      return;
    }
    setAddSaving(true);
    setAddError(null);
    try {
      const newCoach = await createCoach({
        firstName: addForm.firstName.trim(),
        lastName: addForm.lastName.trim(),
      });
      router.push(`/coaches/${newCoach.id}`);
    } catch {
      setAddError('Failed to create coach');
      setAddSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Coaches
        </Typography>
        <Button variant="contained" onClick={handleOpenAddDialog}>
          Add Coach
        </Button>
      </Box>

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
                        (coach.rosters ?? []).map(r => [r.collegeCodeName, r.collegeShortName])
                      ).values(),
                    ].join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <Dialog
        open={addDialogOpen}
        onClose={() => !addSaving && setAddDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Coach</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              value={addForm.firstName}
              onChange={e => setAddForm({ ...addForm, firstName: e.target.value })}
              required
              fullWidth
              slotProps={{ htmlInput: { maxLength: 40 } }}
            />
            <TextField
              label="Last Name"
              value={addForm.lastName}
              onChange={e => setAddForm({ ...addForm, lastName: e.target.value })}
              required
              fullWidth
              slotProps={{ htmlInput: { maxLength: 40 } }}
            />
            {addError && <Alert severity="error">{addError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} disabled={addSaving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddCoach} disabled={addSaving}>
            {addSaving ? 'Saving...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
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
