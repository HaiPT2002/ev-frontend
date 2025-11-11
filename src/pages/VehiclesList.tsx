import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getVehicles } from '../api/api';
import { useError } from '../contexts/ErrorContext';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Link from '@mui/material/Link';

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getVehicles();
        if (mounted) setVehicles(data);
      } catch (err) {
        console.error('Failed to fetch vehicles', err);
        showError('Failed to load vehicles');
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
        Vehicles
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Search/filter by model, brand, price.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3,1fr)' },
          gap: 2,
        }}
      >
        {(loading ? new Array(6).fill(null) : vehicles).map((v: any, idx: number) => (
          <Card key={v?.id ?? idx}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">
                    <Link component={RouterLink} to={`/vehicles/${v.id}`}>
                      {v.manufacturer} {v.model}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {v.price ? `${v.price}` : 'Price N/A'}
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
