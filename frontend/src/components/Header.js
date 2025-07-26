import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import '../styles/dashboard.css';

export default function Header() {
  return (
    <AppBar position="sticky" color="primary" elevation={3} sx={{ borderRadius: 0, mb: 3, background: 'linear-gradient(90deg, #232526 0%, #2D4059 100%)' }}>
      <Toolbar>
        <SavingsIcon sx={{ mr: 2, fontSize: 32, color: '#FFD460' }} />
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 2, color: '#FFD460' }}>
          SpendWise Dashboard
        </Typography>
        <Box sx={{ flexGrow: 0 }} />
      </Toolbar>
    </AppBar>
  );
}
