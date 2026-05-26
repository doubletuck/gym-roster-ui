'use client';

import Alert from '@mui/material/Alert';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateCoach, deleteCoach } from '@/lib/api/coaches';
import { createCoachRosterEntry, deleteCoachRosterEntry } from '@/lib/api/roster';
import { useCoach } from '@/lib/hooks/useCoach';
import { useColleges } from '@/lib/hooks/useColleges';
import { useStaffRoles } from '@/lib/hooks/useStaffRoles';
import { College } from '@/lib/definitions';

const collegeFilterOptions = createFilterOptions<College>({
  stringify: option => `${option.shortName} ${option.longName} ${option.codeName}`,
});

type RosterForm = {
  college: College | null;
  seasonYear: string;
  roleCode: string;
};

const initialRosterForm: RosterForm = { college: null, seasonYear: '', roleCode: '' };

type SnackbarState = { open: boolean; message: string; severity: 'success' | 'error' };

export default function CoachDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { coach, loading, error, refresh } = useCoach(id as string);

  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '' });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [rosterForm, setRosterForm] = useState<RosterForm>(initialRosterForm);
  const [addingRoster, setAddingRoster] = useState(false);
  const [rosterAddError, setRosterAddError] = useState<string | null>(null);

  const { colleges, loading: collegesLoading } = useColleges(editMode);
  const { staffRoles } = useStaffRoles();

  const showSnackbar = (message: string, severity: 'success' | 'error') =>
    setSnackbar({ open: true, message, severity });

  const handleEditClick = () => {
    if (coach) {
      setForm({ firstName: coach.firstName, lastName: coach.lastName });
    }
    setRosterForm(initialRosterForm);
    setRosterAddError(null);
    setEditMode(true);
  };

  const handleCancel = () => setEditMode(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteCoach(id as string);
      router.push('/coaches');
    } catch {
      setDeleting(false);
      setDeleteDialogOpen(false);
      showSnackbar('Failed to delete coach', 'error');
    }
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      showSnackbar('First name and last name are required', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateCoach(id as string, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });
      refresh();
      showSnackbar('Coach saved successfully', 'success');
    } catch {
      showSnackbar('Failed to save coach', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoster = async (rosterId: string) => {
    try {
      await deleteCoachRosterEntry(rosterId);
      refresh();
      showSnackbar('Roster entry removed', 'success');
    } catch {
      showSnackbar('Failed to remove roster entry', 'error');
    }
  };

  const handleAddRoster = async () => {
    if (!rosterForm.college || !rosterForm.seasonYear || !rosterForm.roleCode) return;
    setAddingRoster(true);
    setRosterAddError(null);
    try {
      await createCoachRosterEntry({
        college: { id: rosterForm.college.id },
        seasonYear: parseInt(rosterForm.seasonYear),
        coach: { id: Number(id) },
        roleCode: rosterForm.roleCode,
      });
      refresh();
      setRosterForm(initialRosterForm);
      showSnackbar('Roster entry added', 'success');
    } catch {
      setRosterAddError('Failed to add roster entry');
    } finally {
      setAddingRoster(false);
    }
  };

  if (loading && !coach) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography>Loading coach details...</Typography>
      </Box>
    );
  }

  if (error && !coach) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!coach) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Coach not found</Typography>
      </Box>
    );
  }

  const sortedRosters = [...(coach.rosters ?? [])].sort((a, b) => b.seasonYear - a.seasonYear);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {coach.firstName} {coach.lastName}
        </Typography>
        {editMode ? (
          <Stack direction="row" spacing={1}>
            <Button onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditClick}>
              Edit
            </Button>
          </Stack>
        )}
      </Box>

      {editMode && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="First Name"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  fullWidth
                  required
                  slotProps={{ htmlInput: { maxLength: 40 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Last Name"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  fullWidth
                  required
                  slotProps={{ htmlInput: { maxLength: 40 } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Roster History
        </Typography>

        {sortedRosters.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell>College</TableCell>
                <TableCell>Role</TableCell>
                {editMode && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRosters.map(roster => (
                <TableRow key={roster.coachRosterId}>
                  <TableCell>{roster.seasonYear}</TableCell>
                  <TableCell>{roster.collegeShortName}</TableCell>
                  <TableCell>
                    {staffRoles.find(r => r.codeName === roster.roleCode)?.longName ??
                      roster.roleCode}
                  </TableCell>
                  {editMode && (
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="delete roster entry"
                        onClick={() => handleDeleteRoster(roster.coachRosterId)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="text.secondary">No roster entries</Typography>
        )}

        {editMode && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Roster Entry
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Autocomplete
                  options={colleges}
                  loading={collegesLoading}
                  getOptionLabel={option => option.shortName}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  filterOptions={collegeFilterOptions}
                  value={rosterForm.college}
                  onChange={(_, value) => setRosterForm({ ...rosterForm, college: value })}
                  renderInput={params => <TextField {...params} label="College" />}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  label="Season Year"
                  type="number"
                  value={rosterForm.seasonYear}
                  onChange={e => setRosterForm({ ...rosterForm, seasonYear: e.target.value })}
                  fullWidth
                  slotProps={{ htmlInput: { min: 1990, max: 2050 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    value={rosterForm.roleCode}
                    onChange={e => setRosterForm({ ...rosterForm, roleCode: e.target.value })}
                    label="Role"
                  >
                    {staffRoles.map(role => (
                      <MenuItem key={role.codeName} value={role.codeName}>
                        {role.longName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleAddRoster}
                  disabled={
                    !rosterForm.college ||
                    !rosterForm.seasonYear ||
                    !rosterForm.roleCode ||
                    addingRoster
                  }
                  sx={{ height: '56px', width: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {rosterAddError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {rosterAddError}
              </Alert>
            )}
          </Box>
        )}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Coach</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {coach.firstName} {coach.lastName}? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
