import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { getCustomers } from '../api/api';
import { useError } from '../contexts/ErrorContext';

export default function CustomersList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCustomers();
        if (mounted) setCustomers(data || []);
      } catch (e) {
        console.error('Failed to load customers', e);
        showError('Failed to load customers');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Customers</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>List customers, purchase history, contact info.</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 2 }}>
        {(loading ? new Array(6).fill(null) : customers).map((c: any, idx: number) => (
          <Card key={c?.id ?? idx}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">{c.name || c.email || c.phone}</Typography>
                  <Typography variant="body2" color="text.secondary">{c.phone || 'Phone N/A'}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
