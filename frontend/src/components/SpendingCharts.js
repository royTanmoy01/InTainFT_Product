import React, { useState } from 'react';
import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup, Stack } from '@mui/material';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';

import DownloadButton from './DownloadButton';
import SpendingPieTable from './SpendingPieTable';
import SpendingBarTable from './SpendingBarTable';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement,  LineElement);

export function SpendingPie({ byCategory }) {
  const [view, setView] = useState('chart');
  // Prepare table data for download
  const tableData = Object.entries(byCategory).map(([cat, amt]) => ({ Category: cat, Amount: amt }));
  // Modern, visually appealing palette
  const palette = [
    '#00B8A9', '#F6416C', '#FFDE7D', '#43D8C9', '#FF8C42', '#6A0572', '#2D4059', '#EA5455',
    '#F07B3F', '#FFD460', '#3EC1D3', '#FF6F3C', '#1FAB89', '#62D2A2', '#F9ED69', '#B83B5E'
  ];
  const data = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        data: Object.values(byCategory),
        backgroundColor: palette,
        borderColor: '#23272f',
        borderWidth: 2,
      },
    ],
  };
  return (
    <Paper elevation={4} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', borderRadius: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="#00B8A9" sx={{ letterSpacing: 1 }}>Spending Breakdown</Typography>
        <Stack direction="row" spacing={1}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            size="small"
            sx={{ background: '#232526', borderRadius: 2 }}
          >
            <ToggleButton value="chart" sx={{ color: '#00B8A9', fontWeight: 700 }}>Chart</ToggleButton>
            <ToggleButton value="table" sx={{ color: '#FFD460', fontWeight: 700 }}>Table</ToggleButton>
          </ToggleButtonGroup>
          <DownloadButton data={tableData} filename="spending_by_category.csv" label="Spending Breakdown" />
        </Stack>
      </Box>
      {view === 'chart' ? (
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Pie data={data} />
          <Doughnut data={data} />
        </Box>
      ) : (
        <SpendingPieTable byCategory={byCategory} />
      )}
    </Paper>
  );
}

export function SpendingBar({ byMonth }) {
  const [view, setView] = useState('chart');
  // Prepare table data for download
  const tableData = Object.entries(byMonth).map(([month, amt]) => ({ Month: month, Amount: amt }));
  // Modern, visually appealing palette
  const palette = [
    '#00B8A9', '#F6416C', '#FFDE7D', '#43D8C9', '#FF8C42', '#6A0572', '#2D4059', '#EA5455',
    '#F07B3F', '#FFD460', '#3EC1D3', '#FF6F3C', '#1FAB89', '#62D2A2', '#F9ED69', '#B83B5E'
  ];
  const data = {
    labels: Object.keys(byMonth),
    datasets: [
      {
        label: 'Monthly Spend',
        data: Object.values(byMonth),
        backgroundColor: palette,
        borderColor: '#23272f',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: '#F6416C',
      },
    ],
  };
  const lineData = {
    labels: Object.keys(byMonth),
    datasets: [
      {
        label: 'Monthly Spend',
        data: Object.values(byMonth),
        fill: true,
        borderColor: '#00B8A9',
        backgroundColor: 'rgba(0,184,169,0.15)',
        pointBackgroundColor: '#F6416C',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 9,
        tension: 0.4,
      },
    ],
  };
  return (
    <Paper elevation={4} sx={{ p: 4, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', borderRadius: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="#F6416C" sx={{ letterSpacing: 1 }}>Monthly Trends</Typography>
        <Stack direction="row" spacing={1}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            size="small"
            sx={{ background: '#232526', borderRadius: 2 }}
          >
            <ToggleButton value="chart" sx={{ color: '#F6416C', fontWeight: 700 }}>Chart</ToggleButton>
            <ToggleButton value="table" sx={{ color: '#FFD460', fontWeight: 700 }}>Table</ToggleButton>
          </ToggleButtonGroup>
          <DownloadButton data={tableData} filename="spending_by_month.csv" label="Monthly Trends" />
        </Stack>
      </Box>
      {view === 'chart' ? (
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Bar data={data} />
          <Line data={lineData} />
        </Box>
      ) : (
        <SpendingBarTable byMonth={byMonth} />
      )}
    </Paper>
  );
}
