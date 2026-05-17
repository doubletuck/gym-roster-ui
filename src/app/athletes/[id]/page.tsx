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
import { updateAthlete, deleteAthlete } from '@/lib/api/athletes';
import { createRosterEntry, deleteRosterEntry } from '@/lib/api/roster';
import { useAthlete } from '@/lib/hooks/useAthlete';
import { useColleges } from '@/lib/hooks/useColleges';
import { College } from '@/lib/definitions';

const ACADEMIC_YEAR_OPTIONS = [
  { label: 'Freshman', value: 'FRESHMAN' },
  { label: 'Sophomore', value: 'SOPHOMORE' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Senior', value: 'SENIOR' },
];

const collegeFilterOptions = createFilterOptions<College>({
  stringify: option => `${option.shortName} ${option.longName} ${option.codeName}`,
});

type RosterForm = {
  college: College | null;
  seasonYear: string;
  academicYear: string;
};

const initialRosterForm: RosterForm = { college: null, seasonYear: '', academicYear: '' };

type Snackbar = { open: boolean; message: string; severity: 'success' | 'error' };

export default function AthleteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { athlete, loading, error, refresh } = useAthlete(id as string);

  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    homeCity: '',
    homeState: '',
    homeCountry: '',
    clubName: '',
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<Snackbar>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [rosterForm, setRosterForm] = useState<RosterForm>(initialRosterForm);
  const [addingRoster, setAddingRoster] = useState(false);
  const [rosterAddError, setRosterAddError] = useState<string | null>(null);

  const { colleges, loading: collegesLoading } = useColleges(editMode);

  const showSnackbar = (message: string, severity: 'success' | 'error') =>
    setSnackbar({ open: true, message, severity });

  const handleEditClick = () => {
    if (athlete) {
      setForm({
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        homeCity: athlete.homeCity,
        homeState: athlete.homeState ?? '',
        homeCountry: athlete.homeCountry ?? '',
        clubName: athlete.clubName ?? '',
      });
    }
    setRosterForm(initialRosterForm);
    setRosterAddError(null);
    setEditMode(true);
  };

  const handleCancel = () => setEditMode(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteAthlete(id as string);
      router.push('/athletes');
    } catch {
      setDeleting(false);
      setDeleteDialogOpen(false);
      showSnackbar('Failed to delete athlete', 'error');
    }
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.homeCity.trim()) {
      showSnackbar('First name, last name, and home city are required', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateAthlete(id as string, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        homeCity: form.homeCity.trim(),
        homeState: form.homeState.trim() || undefined,
        homeCountry: form.homeCountry.trim() || undefined,
        clubName: form.clubName.trim() || undefined,
      });
      refresh();
      showSnackbar('Athlete saved successfully', 'success');
    } catch {
      showSnackbar('Failed to save athlete', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoster = async (rosterId: string) => {
    try {
      await deleteRosterEntry(rosterId);
      refresh();
      showSnackbar('Roster entry removed', 'success');
    } catch {
      showSnackbar('Failed to remove roster entry', 'error');
    }
  };

  const handleAddRoster = async () => {
    if (!rosterForm.college || !rosterForm.seasonYear || !rosterForm.academicYear) return;
    setAddingRoster(true);
    setRosterAddError(null);
    try {
      await createRosterEntry({
        collegeId: rosterForm.college.id,
        athleteId: Number(id),
        seasonYear: parseInt(rosterForm.seasonYear),
        academicYear: rosterForm.academicYear,
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

  if (loading && !athlete) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography>Loading athlete details...</Typography>
      </Box>
    );
  }

  if (error && !athlete) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!athlete) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Athlete not found</Typography>
      </Box>
    );
  }

  const sortedRosters = [...athlete.rosters].sort((a, b) => b.seasonYear - a.seasonYear);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {athlete.firstName} {athlete.lastName}
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

      <Card>
        <CardContent>
          {editMode ? (
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Home City"
                  value={form.homeCity}
                  onChange={e => setForm({ ...form, homeCity: e.target.value })}
                  fullWidth
                  required
                  slotProps={{ htmlInput: { maxLength: 50 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Home State"
                  value={form.homeState}
                  onChange={e => setForm({ ...form, homeState: e.target.value })}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 2 } }}
                  helperText="2-character state code (e.g. CA)"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Home Country"
                  value={form.homeCountry}
                  onChange={e => setForm({ ...form, homeCountry: e.target.value })}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 3 } }}
                  helperText="3-character country code (e.g. USA)"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Club Name"
                  value={form.clubName}
                  onChange={e => setForm({ ...form, clubName: e.target.value })}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Home Location
                </Typography>
                <Typography>
                  {athlete.homeCity}
                  {athlete.homeState ? `, ${athlete.homeState}` : ''}, {athlete.homeCountry}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Club Name
                </Typography>
                <Typography>{athlete.clubName}</Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Roster History
        </Typography>

        {sortedRosters.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>College</TableCell>
                {editMode && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRosters.map(roster => (
                <TableRow key={roster.athleteRosterId}>
                  <TableCell>{roster.seasonYear}</TableCell>
                  <TableCell>{roster.academicYear}</TableCell>
                  <TableCell>{roster.collegeShortName}</TableCell>
                  {editMode && (
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="delete roster entry"
                        onClick={() => handleDeleteRoster(roster.athleteRosterId)}
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
            <Grid container spacing={2} alignItems="flex-start">
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
                  <InputLabel id="academic-year-label">Academic Year</InputLabel>
                  <Select
                    labelId="academic-year-label"
                    value={rosterForm.academicYear}
                    onChange={e => setRosterForm({ ...rosterForm, academicYear: e.target.value })}
                    label="Academic Year"
                  >
                    {ACADEMIC_YEAR_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
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
                    !rosterForm.academicYear ||
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
        <DialogTitle>Delete Athlete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {athlete.firstName} {athlete.lastName}? This action
            cannot be undone.
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
