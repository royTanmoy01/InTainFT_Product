import React, { useState } from 'react';
import { Box, Typography, Slider, Button, Paper, LinearProgress } from '@mui/material';

export default function BudgetTracker({ analysis }) {
  const [budget, setBudget] = useState(analysis?.budget || 20000);
  const spent = analysis?.totalSpent || 0;
  const percent = Math.min(100, Math.round((spent / budget) * 100));

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #232526 0%, #262A34 100%)', color: '#F6F6F6' }}>
      <Typography variant="h6" fontWeight={700} color="#00B8A9" mb={2}>Budget Tracker</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>Set Monthly Budget: ₹{budget.toLocaleString('en-IN')}</Typography>
        <Slider
          value={budget}
          min={5000}
          max={100000}
          step={1000}
          onChange={(_, v) => setBudget(v)}
          valueLabelDisplay="auto"
          sx={{ color: '#00B8A9' }}
        />
      </Box>
      <Typography>Spent: <b>₹{spent.toLocaleString('en-IN')}</b> / ₹{budget.toLocaleString('en-IN')}</Typography>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 12, borderRadius: 6, my: 2, background: '#232526', '& .MuiLinearProgress-bar': { background: percent > 90 ? '#F6416C' : '#00B8A9' } }} />
      <Typography color={percent > 90 ? 'error' : 'success.main'}>
        {percent > 100 ? 'Over budget!' : `${percent}% of budget used`}
      </Typography>
    </Paper>
  );
}
