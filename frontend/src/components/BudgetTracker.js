import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, Paper, LinearProgress, Chip, Avatar, Fade } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import '../styles/dashboard.css';

export default function BudgetTracker({ analysis }) {
  const getInitialBudget = () => {
    const val = localStorage.getItem('budget');
    const num = Number(val);
    return !val || isNaN(num) || num < 5000 ? 20000 : num;
  };
  
  const [budget, setBudget] = useState(getInitialBudget);
  
  useEffect(() => { 
    localStorage.setItem('budget', budget); 
  }, [budget]);
  
  const spent = analysis?.total || 0;
  const remaining = budget - spent;
  const percent = Math.min(100, Math.round((spent / budget) * 100));

  return (
    <Fade in timeout={800}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              mr: 2, 
              background: 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)',
              width: 48,
              height: 48
            }}
          >
            <AccountBalance />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#333' }}>
              Budget Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              AI-powered spending insights
            </Typography>
          </Box>
          <Chip 
            label={percent > 90 ? 'Critical' : percent > 70 ? 'Warning' : 'Healthy'} 
            size="small" 
            sx={{ 
              ml: 'auto',
              background: percent > 90 ? '#f44336' : percent > 70 ? '#ff9800' : '#4caf50',
              color: '#fff',
              fontWeight: 600
            }} 
          />
        </Box>

        {/* Budget Slider */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 2, color: '#333' }}>
            Monthly Budget: ₹{budget.toLocaleString('en-IN')}
          </Typography>
          <Slider
            value={budget}
            min={5000}
            max={100000}
            step={1000}
            onChange={(_, v) => setBudget(v)}
            valueLabelDisplay="auto"
            sx={{ 
              color: '#4caf50',
              height: 8,
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                background: 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
              },
              '& .MuiSlider-track': {
                background: 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)'
              },
              '& .MuiSlider-rail': {
                background: '#e0e0e0'
              }
            }}
          />
        </Box>

        {/* Spending Overview */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 1, width: 32, height: 32, background: '#f44336' }}>
                <TrendingUp sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: '#666' }}>Spent</Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f44336' }}>
              ₹{spent.toLocaleString('en-IN')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 1, width: 32, height: 32, background: '#4caf50' }}>
                <TrendingDown sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: '#666' }}>Remaining</Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#4caf50' }}>
              ₹{remaining.toLocaleString('en-IN')}
            </Typography>
          </Box>

          {/* Progress Bar */}
          <LinearProgress 
            variant="determinate" 
            value={percent} 
            sx={{ 
              height: 12, 
              borderRadius: 6, 
              background: '#f5f5f5',
              '& .MuiLinearProgress-bar': { 
                background: percent > 90 
                  ? 'linear-gradient(45deg, #f44336, #d32f2f)' 
                  : percent > 70 
                  ? 'linear-gradient(45deg, #ff9800, #f57c00)'
                  : 'linear-gradient(45deg, #4caf50, #388e3c)',
                borderRadius: 6
              } 
            }} 
          />
        </Box>

        {/* Status Message */}
        <Box 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            background: percent > 90 
              ? 'rgba(244, 67, 54, 0.1)' 
              : percent > 70 
              ? 'rgba(255, 152, 0, 0.1)'
              : 'rgba(76, 175, 80, 0.1)',
            border: percent > 90 
              ? '1px solid rgba(244, 67, 54, 0.2)' 
              : percent > 70 
              ? '1px solid rgba(255, 152, 0, 0.2)'
              : '1px solid rgba(76, 175, 80, 0.2)',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ 
              color: percent > 90 ? '#f44336' : percent > 70 ? '#f57c00' : '#4caf50',
              mb: 1
            }}
          >
            {percent}% Budget Used
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: percent > 90 ? '#d32f2f' : percent > 70 ? '#ef6c00' : '#388e3c'
            }}
          >
            {percent > 100 
              ? `You're ₹${(spent - budget).toLocaleString('en-IN')} over budget!` 
              : percent > 90 
              ? 'You\'re approaching your budget limit'
              : percent > 70 
              ? 'You\'re on track but monitor closely'
              : 'Great job staying within budget!'
            }
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
}
