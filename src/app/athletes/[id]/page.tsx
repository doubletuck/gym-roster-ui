'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
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
    </Box>
  );
}
