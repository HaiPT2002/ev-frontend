import React, { useEffect, useState } from 'react';
import { getPayments } from '../api/api';
import { useError } from '../contexts/ErrorContext';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export default function PaymentsList() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPayments();
        if (mounted) setPayments(data);
      } catch (err) {
        console.error('Failed to fetch payments', err);
        showError('Failed to load payments');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Payments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        List transactions, status, lookup by vnp_TxnRef.
      </Typography>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 2 }}
      >
        {(loading ? new Array(6).fill(null) : payments).map((p: any, idx: number) => (
          <Card key={p?.id ?? idx}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="60%" />
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">{p.id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.status || 'N/A'} — {p.amount || ''}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
