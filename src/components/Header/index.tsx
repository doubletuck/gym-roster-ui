'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Rosters', href: '/' },
  { label: 'Athletes', href: '/athletes' },
  { label: 'Coaches', href: '/' },
  { label: 'Colleges', href: '/' },
];

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          GymRoster
        </Typography>
        {navLinks.map(({ label, href }) => (
          <Button key={label} color="inherit" component={Link} href={href}>
            {label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
