import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      width: '100%',
      py: 2,
      px: 2,
      mt: 6,
      background: 'linear-gradient(90deg, #232526 0%, #2D4059 100%)',
      color: '#B2B2B2',
      textAlign: 'center',
      fontSize: 15,
      letterSpacing: 1,
      borderTop: '1px solid #2D4059',
    }}>
      <Typography variant="body2">
        Personal Spending Intelligence Platform &copy; {new Date().getFullYear()} &mdash; Built for Intain PoC Challenge
      </Typography>
    </Box>
  );
}
