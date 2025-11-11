import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EV Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={NavLink as any} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={NavLink as any} to="/vehicles">
              Vehicles
            </Button>
            <Button color="inherit" component={NavLink as any} to="/contracts">
              Contracts
            </Button>
            <Button color="inherit" component={NavLink as any} to="/customers">
              Customers
            </Button>
            <Button color="inherit" component={NavLink as any} to="/testdrives">
              Test Drives
            </Button>
            <Button color="inherit" component={NavLink as any} to="/payments">
              Payments
            </Button>
            {user?.role === 'ADMIN' && (
              <>
                <Button color="inherit" component={NavLink as any} to="/users">
                  Users
                </Button>
                <Button color="inherit" component={NavLink as any} to="/settings">
                  Settings
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ marginLeft: 2 }}>
            {user ? (
              <>
                <Typography component="span" variant="body2" sx={{ marginRight: 2 }}>
                  {user.name} ({user.role})
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={NavLink as any} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
