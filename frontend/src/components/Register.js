
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Hash password with SHA-256 before sending
      const hashedPassword = CryptoJS.SHA256(password).toString();
      await axios.post('/api/auth/register', { name, email, password: hashedPassword });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #b2f2bb 0%, #f6fff8 100%)' }}>
      <Paper elevation={4} sx={{ p: 4, minWidth: 340, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary">Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} required />
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Typography color="error" mt={1}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }}>Register</Button>
          <Button color="secondary" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/login')}>Back to Login</Button>
        </form>
      </Paper>
    </Box>
  );
}
