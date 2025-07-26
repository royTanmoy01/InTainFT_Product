import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import '../styles/charts.css';

export default function PaymentMethodChart({ transactions }) {
  const methodCounts = transactions.reduce((acc, tx) => {
    acc[tx.method] = (acc[tx.method] || 0) + 1;
    return acc;
  }, {});
  const palette = [
    '#00B8A9', '#F6416C', '#FFDE7D', '#43D8C9', '#FF8C42', '#6A0572', '#2D4059', '#EA5455'
  ];
  const data = {
    labels: Object.keys(methodCounts),
    datasets: [
      {
        data: Object.values(methodCounts),
        backgroundColor: palette,
        borderWidth: 1,
      },
    ],
  };
  return (
    <Paper elevation={4} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', borderRadius: 4 }}>
      <Typography variant="h6" fontWeight={700} color="#43D8C9" sx={{ mb: 2, letterSpacing: 1 }}>Payment Method Preferences</Typography>
      <Pie data={data} />
    </Paper>
  );
}
