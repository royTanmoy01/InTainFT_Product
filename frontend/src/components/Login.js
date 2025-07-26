import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Paper, IconButton, 
  InputAdornment, Fade, Grow, Chip
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Email, Lock } from '@mui/icons-material';
import axios from 'axios';
import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Google OAuth redirect with token in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token, '', 86400);
      window.history.replaceState({}, document.title, window.location.pathname);
      // Call import API after setting token
      axios.post('/api/transactions/import', { 
        from: Math.floor(new Date('2024-07-01').getTime() / 1000), 
        to: Math.floor(new Date('2024-07-17').getTime() / 1000) 
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      }).finally(() => {
        navigate('/dashboard');
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const res = await axios.post('/api/auth/login', { 
        email, 
        password: hashedPassword 
      });
      
      if (res.data.token || res.data.refreshToken) {
        setToken(res.data.token, res.data.refreshToken, 900);
        
        // Import transactions after successful login
        await axios.post('/api/transactions/import', { 
          from: Math.floor(new Date('2024-07-01').getTime() / 1000), 
          to: Math.floor(new Date('2024-07-17').getTime() / 1000) 
        }, { 
          headers: { Authorization: `Bearer ${res.data.token}` } 
        });
        
        navigate('/dashboard');
      } else {
        setError('Authentication failed: Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <Fade in timeout={800}>
        <Paper 
          elevation={24} 
          sx={{ 
            p: 6, 
            minWidth: 420, 
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header with gradient accent */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Grow in timeout={1000}>
              <Typography 
                variant="h3" 
                fontWeight={800} 
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                SpendWise
              </Typography>
            </Grow>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                fontWeight: 300,
                letterSpacing: 1
              }}
            >
              Financial Intelligence Platform
            </Typography>
            <Chip 
              label="V1" 
              size="small" 
              sx={{ 
                mt: 2,
                background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                color: '#fff',
                fontWeight: 600
              }} 
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)',
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#764ba2' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)',
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#764ba2' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Fade in>
                <Typography 
                  color="error" 
                  sx={{ 
                    mb: 3, 
                    textAlign: 'center',
                    background: 'rgba(244, 67, 54, 0.1)',
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(244, 67, 54, 0.2)'
                  }}
                >
                  {error}
                </Typography>
              </Fade>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 2,
                mb: 3,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)'
                },
                '&:disabled': {
                  background: 'rgba(102, 126, 234, 0.6)'
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                py: 2,
                mb: 3,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 600,
                borderColor: '#4285f4',
                color: '#4285f4',
                '&:hover': {
                  background: 'rgba(66, 133, 244, 0.1)',
                  borderColor: '#3367d6',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Continue with Google
            </Button>
          </form>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              color: '#666',
              '& a': { 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' }
              }
            }}
          >
            Don't have an account? <a href="/register">Create one</a>
          </Typography>
        </Paper>
      </Fade>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    </Box>
  );
}
