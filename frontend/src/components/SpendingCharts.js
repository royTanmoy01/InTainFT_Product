import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup, 
  Stack,
  Avatar,
  Chip,
  Fade,
  Zoom
} from '@mui/material';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp,
  Analytics,
  AutoAwesome,
  DonutLarge
} from '@mui/icons-material';

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
import '../styles/charts.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

export function SpendingPie({ byCategory = {} }) {
  const [view, setView] = useState('chart');
  
  // Prepare table data for download
  const tableData = Object.entries(byCategory || {}).map(([cat, amt]) => ({ Category: cat, Amount: amt }));
  
  const palette = [
    '#667eea', '#764ba2', '#ff6b6b', '#ffd93d', '#56ab2f', '#ff8a00', 
    '#ff416c', '#a8e6cf', '#ffecd2', '#fcb69f', '#3ec1d3', '#43d8c9',
    '#f07b3f', '#62d2a2', '#f9ed69', '#b83b5e'
  ];
  
  const data = {
    labels: Object.keys(byCategory || {}),
    datasets: [
      {
        data: Object.values(byCategory || {}),
        backgroundColor: palette,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverBorderColor: '#fff',
        cutout: '60%'
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          },
          color: '#333',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: 'rgba(102, 126, 234, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        boxPadding: 6
      }
    }
  };

  return (
    <Fade in timeout={800}>
      <Paper 
        elevation={24} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            opacity: 0.05
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mr: 2,
                width: 48,
                height: 48
              }}
            >
              <PieChartIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h5" 
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Spending Breakdown
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Category-wise expense analysis
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, v) => v && setView(v)}
              size="small"
              sx={{
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: 3,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '12px !important',
                  mx: 0.5,
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)'
                  }
                }
              }}
            >
              <ToggleButton value="chart">
                <Analytics sx={{ mr: 1, fontSize: '1rem' }} />
                Chart
              </ToggleButton>
              {/* <ToggleButton value="table">
                <BarChartIcon sx={{ mr: 1, fontSize: '1rem' }} />
                Table
              </ToggleButton> */}
            </ToggleButtonGroup>
            
            <DownloadButton 
              data={tableData} 
              filename="spending_by_category.csv" 
              label="Spending Breakdown" 
            />
          </Stack>
        </Box>
        
        {view === 'chart' ? (
          <Zoom in timeout={600}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 4, 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                background: 'rgba(102, 126, 234, 0.02)',
                borderRadius: 3,
                p: 3,
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}
            >
              <Box sx={{ position: 'relative', height: 400, minWidth: 300 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    color: '#666',
                    fontWeight: 600 
                  }}
                >
                  <PieChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Distribution View
                </Typography>
                <Pie data={data} options={chartOptions} />
              </Box>
              
              <Box sx={{ position: 'relative', height: 400, minWidth: 300 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    color: '#666',
                    fontWeight: 600 
                  }}
                >
                  <DonutLarge sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Donut View
                </Typography>
                <Doughnut data={data} options={chartOptions} />
              </Box>
            </Box>
          </Zoom>
        ) : (
          <Fade in timeout={400}>
            <SpendingPieTable byCategory={byCategory} />
          </Fade>
        )}
      </Paper>
    </Fade>
  );
}

export function SpendingBar({ byMonth = {} }) {
  const [view, setView] = useState('chart');
  
  // Prepare table data for download
  const tableData = Object.entries(byMonth || {}).map(([month, amt]) => ({ Month: month, Amount: amt }));
  
  // Modern gradient palette
  const palette = [
    '#667eea', '#764ba2', '#ff6b6b', '#ffd93d', '#56ab2f', '#ff8a00', 
    '#ff416c', '#a8e6cf', '#ffecd2', '#fcb69f', '#3ec1d3', '#43d8c9',
    '#f07b3f', '#62d2a2', '#f9ed69', '#b83b5e'
  ];
  
  const data = {
    labels: Object.keys(byMonth || {}),
    datasets: [
      {
        label: 'Monthly Spend',
        data: Object.values(byMonth || {}),
        backgroundColor: palette,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: '#ff6b6b',
        hoverBorderColor: '#fff',
        hoverBorderWidth: 3
      },
    ],
  };
  
  const lineData = {
    labels: Object.keys(byMonth || {}),
    datasets: [
      {
        label: 'Monthly Spend',
        data: Object.values(byMonth || {}),
        fill: true,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.15)',
        pointBackgroundColor: '#ff6b6b',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#ffd93d',
        tension: 0.4,
        borderWidth: 4
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          },
          color: '#333',
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: 'rgba(102, 126, 234, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(102, 126, 234, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#666',
          font: {
            weight: '600'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(102, 126, 234, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#666',
          font: {
            weight: '600'
          }
        }
      }
    }
  };

  return (
    <Fade in timeout={1000}>
      <Paper 
        elevation={24} 
        sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 200,
            height: 200,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
            borderRadius: '50%',
            opacity: 0.05
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
                mr: 2,
                width: 48,
                height: 48
              }}
            >
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography 
                variant="h5" 
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Monthly Trends
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Time-based spending patterns
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={<AutoAwesome />}
              label="Trend Analysis"
              sx={{
                background: 'linear-gradient(45deg, #56ab2f, #a8e6cf)',
                color: '#fff',
                fontWeight: 600
              }}
            />
            
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, v) => v && setView(v)}
              size="small"
              sx={{
                background: 'rgba(255, 107, 107, 0.1)',
                borderRadius: 3,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '12px !important',
                  mx: 0.5,
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  color: '#ff6b6b',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
                    color: '#fff',
                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff5252 0%, #ffcc02 100%)'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.1)'
                  }
                }
              }}
            >
              <ToggleButton value="chart">
                <Analytics sx={{ mr: 1, fontSize: '1rem' }} />
                Chart
              </ToggleButton>
              {/* <ToggleButton value="table">
                <BarChartIcon sx={{ mr: 1, fontSize: '1rem' }} />
                Table
              </ToggleButton> */}
            </ToggleButtonGroup>
            
            <DownloadButton 
              data={tableData} 
              filename="spending_by_month.csv" 
              label="Monthly Trends" 
            />
          </Stack>
        </Box>
        
        {view === 'chart' ? (
          <Zoom in timeout={600}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 4, 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                background: 'rgba(255, 107, 107, 0.02)',
                borderRadius: 3,
                p: 3,
                border: '1px solid rgba(255, 107, 107, 0.1)'
              }}
            >
              <Box sx={{ position: 'relative', height: 400, minWidth: 350 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    color: '#666',
                    fontWeight: 600 
                  }}
                >
                  <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Bar Chart View
                </Typography>
                <Bar data={data} options={chartOptions} />
              </Box>
              
              <Box sx={{ position: 'relative', height: 400, minWidth: 350 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    color: '#666',
                    fontWeight: 600 
                  }}
                >
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Trend Line View
                </Typography>
                <Line data={lineData} options={chartOptions} />
              </Box>
            </Box>
          </Zoom>
        ) : (
          <Fade in timeout={400}>
            <SpendingBarTable byMonth={byMonth} />
          </Fade>
        )}
      </Paper>
    </Fade>
  );
}
