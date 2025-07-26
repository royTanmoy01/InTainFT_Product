import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar } from '@mui/material';
import axios from 'axios';
import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export default function Login() {
  const navigate = useNavigate();
  // Handle Google OAuth redirect with token in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token, '', 86400); // 24 hour expiry for Google login
      window.history.replaceState({}, document.title, window.location.pathname);
      // Call import API after setting token
      axios.post('/api/transactions/import', { from: Math.floor(new Date('2024-07-01').getTime() / 1000), to: Math.floor(new Date('2024-07-17').getTime() / 1000) }, { headers: { Authorization: `Bearer ${token}` } })
        .finally(() => {
          navigate('/dashboard');
        });
    }
  }, [navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Hash password with SHA-256 before sending
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const res = await axios.post('/api/auth/login', { email, password: hashedPassword });
      if (res.data.token || res.data.refreshToken) {
        setToken(res.data.token, res.data.refreshToken, 900); // 15 min expiry
        navigate('/dashboard');
        await axios.post('/api/transactions/import', { from: Math.floor(new Date('2024-07-01').getTime() / 1000), to: Math.floor(new Date('2024-07-17').getTime() / 1000) }, { headers: { Authorization: `Bearer ${res.data.token}` } });
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #b2f2bb 0%, #f6fff8 100%)' }}>
      <Paper elevation={4} sx={{ p: 4, minWidth: 340, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary">Sign In</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Typography color="error" mt={1}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }}>Login</Button>
          <Button color="secondary" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/register')}>Create Account</Button>
        </form>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" mb={1}>or</Typography>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ py: 1.2, fontWeight: 600, borderRadius: 2, borderColor: '#4285F4', color: '#4285F4', mb: 1 }}
            startIcon={
              <Avatar src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" sx={{ width: 24, height: 24, bgcolor: 'transparent' }} />
            }
            onClick={() => window.location.href = '/api/auth/google'}
          >
            Sign in with Google
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
