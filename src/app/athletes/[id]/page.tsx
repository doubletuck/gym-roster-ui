'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Athlete } from '@/lib/definitions';
import { useParams } from 'next/navigation';

export default function AthleteDetail() {
  const { id } = useParams();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAthlete = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/athlete/${id}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch athlete');
        }
        const data = await response.json();
        setAthlete(data);
      } catch (error) {
        console.error('Error fetching athlete:', error);
        setError('Failed to load athlete details');
      } finally {
        setLoading(false);
      }
    };

    loadAthlete();
  }, [id]);

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
