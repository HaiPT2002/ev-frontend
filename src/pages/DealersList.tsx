import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { getDealers } from '../api/api';
import { useError } from '../contexts/ErrorContext';

export default function DealersList() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getDealers();
        if (mounted) setDealers(data || []);
      } catch (e) {
        console.error('Failed to load dealers', e);
        showError('Failed to load dealers');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Dealers</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Manage dealers, address and contact.</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 2 }}>
        {(loading ? new Array(6).fill(null) : dealers).map((d: any, idx: number) => (
          <Card key={d?.id ?? idx}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">{d.name || 'Dealer'}</Typography>
                  <Typography variant="body2" color="text.secondary">{d.address || 'Address N/A'}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
