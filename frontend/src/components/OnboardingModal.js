import React from 'react';
import { Modal, Box, Typography, Button, Paper, Avatar, Chip, Fade, Slide } from '@mui/material';
import { AutoAwesome, TrendingUp, Security, Analytics } from '@mui/icons-material';

export default function OnboardingModal({ open, onClose }) {
  const features = [
    {
      icon: <Analytics />,
      title: 'AI-Powered Analytics',
      description: 'Smart categorization and spending insights'
    },
    {
      icon: <TrendingUp />,
      title: 'Real-time Tracking',
      description: 'Live updates and trend analysis'
    },
    {
      icon: <Security />,
      title: 'Bank-level Security',
      description: 'Your data is encrypted and protected'
    }
  ];

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Fade in={open} timeout={600}>
        <Paper
          elevation={24}
          sx={{
            p: 6,
            minWidth: 500,
            maxWidth: 600,
            borderRadius: 6,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
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
              opacity: 0.1
            }}
          />

          {/* Header */}
          <Slide direction="down" in={open} timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '2rem'
                }}
              >
                <AutoAwesome sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography 
                variant="h3" 
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Welcome to SpendWise
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#666',
                  fontWeight: 300,
                  mb: 2
                }}
              >
                The Future of Financial Intelligence
              </Typography>
              
              <Chip 
                label="AI-Powered • 2030 Edition" 
                sx={{ 
                  background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2
                }} 
              />
            </Box>
          </Slide>

          {/* Features */}
          <Box sx={{ mb: 4 }}>
            {features.map((feature, index) => (
              <Slide 
                key={feature.title}
                direction="up" 
                in={open} 
                timeout={800 + index * 200}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      mr: 3, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: 48,
                      height: 48
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#333', mb: 0.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Slide>
            ))}
          </Box>

          {/* Description */}
          <Slide direction="up" in={open} timeout={1400}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                color: '#555',
                lineHeight: 1.6
              }}
            >
              Transform your financial habits with intelligent insights, automated categorization, 
              and personalized recommendations. Track transactions, set smart budgets, and 
              discover spending patterns you never knew existed.
            </Typography>
          </Slide>

          {/* Action Button */}
          <Slide direction="up" in={open} timeout={1600}>
            <Button
              variant="contained"
              size="large"
              onClick={onClose}
              sx={{
                py: 2,
                px: 6,
                borderRadius: 3,
                fontSize: '1.2rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 20px 45px rgba(102, 126, 234, 0.6)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              🚀 Start Your Journey
            </Button>
          </Slide>
        </Paper>
      </Fade>
    </Modal>
  );
}
