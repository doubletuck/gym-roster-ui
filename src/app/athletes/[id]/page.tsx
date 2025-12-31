'use client';

import { useEffect, useState } from 'react';
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

  if (loading) return <div className="p-6">Loading athlete details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!athlete) return <div className="p-6">Athlete not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {athlete.firstName} {athlete.lastName}
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Home Location</h2>
            <p className="mt-1">
              {athlete.homeCity}
              {athlete.homeState ? `, ${athlete.homeState}` : ''}, {athlete.homeCountry}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Club Name</h2>
            <p className="mt-1">{athlete.clubName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
