'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { useAthletes } from '@/lib/hooks/useAthletes';

const PAGE_SIZE = 30;

export default function Page() {
  const [page, setPage] = useState(1);
  const { athletes, totalPages, loading, error } = useAthletes(page, PAGE_SIZE);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Athletes
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Loading athletes...</Typography>
        </Box>
      )}
      {!loading && error && <Typography color="error">{error}</Typography>}
      {!loading && !error && athletes.length === 0 && <Typography>No athletes found.</Typography>}
      {!loading && !error && athletes.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Home Location</TableCell>
              <TableCell>Home Country</TableCell>
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
                <TableCell>{athlete.clubName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
