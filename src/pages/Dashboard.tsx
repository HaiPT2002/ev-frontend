import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

function StatCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5">{value}</Typography>
    </Paper>
  )
}

export default function Dashboard() {
  // TODO: wire to API for real numbers
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Contracts" value={124} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Vehicles in Stock" value={58} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue (30d)" value="$42,300" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Upcoming Test Drives" value={8} />
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, mt: 1 }}>
            <Typography variant="subtitle1">Recent activity</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="text.secondary">
              • Contract #C-0123 created by Dealer A
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Vehicle VIN 1234 assigned to Test Drive on 2025-11-15
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
