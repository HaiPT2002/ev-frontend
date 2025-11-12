import React, { useEffect, useState, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  compareVehicles,
} from '../api/api';
import { useError } from '../contexts/ErrorContext';
import { useAuth } from '../auth/AuthProvider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuVehicleId, setMenuVehicleId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareResult, setCompareResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formManufacturer, setFormManufacturer] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formErrors, setFormErrors] = useState<{ manufacturer?: string; model?: string; price?: string }>({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getVehicles();
        if (mounted) setVehicles(data || []);
      } catch (e: any) {
        console.error('Failed to fetch vehicles', e);
        showError('Failed to load vehicles');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (createOpen) {
      if (editing) {
        setFormManufacturer(editing.manufacturer || '');
        setFormModel(editing.model || '');
        setFormPrice(editing.price ? String(editing.price) : '');
      } else {
        setFormManufacturer('');
        setFormModel('');
        setFormPrice('');
      }
      setFormErrors({});
      setFormError('');
    }
  }, [createOpen, editing]);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">Vehicles</Typography>
          <Typography variant="body2" color="text.secondary">
            Search/filter by model, brand, price.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Search model or manufacturer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {user && (user.role === 'ADMIN' || user.role === 'EVM_STAFF') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Create
            </Button>
          )}
          {/* Dev helper: simulate signing in as EVM_STAFF to test create/update/delete locally */}
          {/* dev sign-in removed */}
          <Button
            variant="outlined"
            startIcon={<CompareArrowsIcon />}
            disabled={selected.length !== 2}
            onClick={async () => {
              if (selected.length === 2) {
                try {
                  setSubmitting(true);
                  const r = await compareVehicles(selected[0], selected[1]);
                  setCompareResult(r);
                  setCompareOpen(true);
                } catch (e) {
                  showError('Compare failed');
                } finally {
                  setSubmitting(false);
                }
              }
            }}
          >
            Compare
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3,1fr)' },
          gap: 2,
        }}
      >
        {(loading ? new Array(6).fill(null) : vehicles.filter((v: any) => {
          if (!searchDebounced) return true;
          const s = searchDebounced.toLowerCase();
          return (`${v.manufacturer} ${v.model} ${v.id}`).toLowerCase().includes(s);
        })).map((v: any, idx: number) => (
          <Card key={v?.id ?? idx}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <FormControlLabel
                      control={<Checkbox checked={selected.includes(v.id)} onChange={() => {
                        setSelected((prev) => prev.includes(v.id) ? prev.filter(x => x !== v.id) : [...prev, v.id]);
                      }} />}
                      label={
                        <Link component={RouterLink} to={`/vehicles/${v.id}`}>
                          {v.manufacturer} {v.model}
                        </Link>
                      }
                    />
                    <IconButton size="small" onClick={(e) => { setMenuAnchor(e.currentTarget); setMenuVehicleId(v.id); }}>
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {v.price ? `${v.price}` : 'Price N/A'}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* per-card menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null); setMenuVehicleId(null); }}>
        <MenuItem onClick={() => { if (menuVehicleId) navigate(`/vehicles/${menuVehicleId}`); setMenuAnchor(null); }}>Details</MenuItem>
        <MenuItem onClick={() => { if (menuVehicleId) { setEditing(vehicles.find(v => v.id === menuVehicleId)); setCreateOpen(true); } setMenuAnchor(null); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={async () => { if (!menuVehicleId) return; if (!confirm('Delete this vehicle?')) return; try { await deleteVehicle(menuVehicleId); setVehicles((prev) => prev.filter(p => p.id !== menuVehicleId)); } catch (e: any) { const status = e?.response?.status; if (status === 403) { const role = user?.role || 'unknown'; showError(`Forbidden: deleting vehicles requires EVM_STAFF or ADMIN (current: ${role})`); } else { const msg = e?.response?.data?.message || e?.message || 'Delete failed'; showError(msg); } } finally { setMenuAnchor(null); setMenuVehicleId(null); } }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
        <MenuItem onClick={() => { if (menuVehicleId) navigate(`/test-drives/create?vehicleId=${menuVehicleId}`); setMenuAnchor(null); }}>Schedule Test Drive</MenuItem>
      </Menu>

      {/* Create / Edit dialog */}
      <Dialog open={createOpen} onClose={() => { setCreateOpen(false); setEditing(null); setFormError(''); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Vehicle' : 'Create Vehicle'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Manufacturer"
              value={formManufacturer}
              onChange={(e) => setFormManufacturer(e.target.value)}
              error={Boolean(formErrors.manufacturer)}
              helperText={formErrors.manufacturer}
              disabled={submitting}
            />
            <TextField
              label="Model"
              value={formModel}
              onChange={(e) => setFormModel(e.target.value)}
              error={Boolean(formErrors.model)}
              helperText={formErrors.model}
              disabled={submitting}
            />
            <TextField
              label="Price"
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              error={Boolean(formErrors.price)}
              helperText={formErrors.price}
              disabled={submitting}
            />
            {formError && (
              <Typography color="error" variant="body2">{formError}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateOpen(false); setEditing(null); setFormError(''); }}>Cancel</Button>
          <Button onClick={async () => {
            // client-side validation
            const errs: any = {};
            if (!formManufacturer.trim()) errs.manufacturer = 'Manufacturer is required';
            if (!formModel.trim()) errs.model = 'Model is required';
            if (!formPrice || isNaN(Number(formPrice))) errs.price = 'Valid price is required';
            setFormErrors(errs);
            if (Object.keys(errs).length) return;

            const payload = { manufacturer: formManufacturer.trim(), model: formModel.trim(), price: Number(formPrice) };
            try {
              setSubmitting(true);
              if (editing) {
                const updated = await updateVehicle(editing.id, payload);
                setVehicles((prev) => prev.map(v => v.id === editing.id ? { ...v, ...updated } : v));
              } else {
                const created = await createVehicle(payload);
                setVehicles((prev) => [created, ...prev]);
              }
              setCreateOpen(false);
              setEditing(null);
              setFormError('');
            } catch (e: any) {
              const status = e?.response?.status;
              const serverMsg = e?.response?.data?.message || e?.message || 'Save failed';
              if (status === 403) {
                const role = user?.role || 'unknown';
                const hint = `Forbidden: creating vehicles requires EVM_STAFF or ADMIN role (current: ${role}). Please log in with an account that has sufficient privileges.`;
                setFormError(hint);
                showError(hint);
              } else if (status === 400 && e?.response?.data?.errors) {
                // map validation errors
                const serverErrors = e.response.data.errors;
                const mapped: any = {};
                Object.keys(serverErrors).forEach((k) => (mapped[k] = serverErrors[k]));
                setFormErrors(mapped);
                setFormError('Validation failed');
              } else {
                setFormError(serverMsg);
                showError('Save failed: ' + serverMsg);
              }
            } finally {
              setSubmitting(false);
            }
          }} variant="contained">{submitting ? <CircularProgress size={18} /> : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Compare dialog */}
      <Dialog open={compareOpen} onClose={() => setCompareOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Compare Vehicles</DialogTitle>
        <DialogContent>
          <pre>{JSON.stringify(compareResult, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
