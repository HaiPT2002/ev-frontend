import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { getUsers } from '../api/api';
import { useError } from '../contexts/ErrorContext';

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getUsers();
        if (mounted) setUsers(data || []);
      } catch (e) {
        console.error('Failed to load users', e);
        showError('Failed to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Users</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Admin: manage users, roles and dealer assignments.</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 2 }}>
        {(loading ? new Array(6).fill(null) : users).map((u: any, idx: number) => (
          <Card key={u?.id ?? idx}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">{u.name || u.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{u.role || 'Role N/A'}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
