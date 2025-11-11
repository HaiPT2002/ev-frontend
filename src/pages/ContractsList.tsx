import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getContracts } from '../api/api';
import { useError } from '../contexts/ErrorContext';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Link from '@mui/material/Link';

export default function ContractsList() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getContracts();
        if (mounted) setContracts(data);
      } catch (err) {
        console.error('Failed to fetch contracts', err);
        showError('Failed to load contracts');
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
        Sale Contracts
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        List contracts, search by status, buyer, dealer.
      </Typography>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 2 }}
      >
        {(loading ? new Array(6).fill(null) : contracts).map((c: any, idx: number) => (
          <Card key={c?.id ?? idx}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="60%" />
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">
                    <Link component={RouterLink} to={`/contracts/${c.id}`}>
                      {c.id}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {c.status || 'N/A'} • Buyer: {c.buyerName || 'N/A'}
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
