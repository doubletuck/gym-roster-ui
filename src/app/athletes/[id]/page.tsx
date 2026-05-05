'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useParams } from 'next/navigation';
import { useAthlete } from '@/lib/hooks/useAthlete';

export default function AthleteDetail() {
  const { id } = useParams();
  const { athlete, loading, error } = useAthlete(id as string);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography>Loading athlete details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!athlete) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Athlete not found</Typography>
      </Box>
    );
  }

  const sortedRosters = [...athlete.rosters].sort((a, b) => b.seasonYear - a.seasonYear);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {athlete.firstName} {athlete.lastName}
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Home Location
              </Typography>
              <Typography>
                {athlete.homeCity}
                {athlete.homeState ? `, ${athlete.homeState}` : ''}, {athlete.homeCountry}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Club Name
              </Typography>
              <Typography>{athlete.clubName}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {sortedRosters.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Roster History
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell>College</TableCell>
                <TableCell>Academic Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRosters.map(roster => (
                <TableRow key={`${roster.collegeCodeName}-${roster.seasonYear}`}>
                  <TableCell>{roster.seasonYear}</TableCell>
                  <TableCell>{roster.collegeShortName}</TableCell>
                  <TableCell>{roster.academicYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
