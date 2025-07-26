import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    axios.get('/api/user/me').then(res => setUser(res.data)).catch(() => {});
  }, []);

  const handleChangePassword = async () => {
    try {
      await axios.post('/api/user/change-password', { password });
      setMessage('Password updated!');
    } catch {
      setMessage('Failed to update password');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
      <Paper elevation={4} sx={{ p: 4, minWidth: 340, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary">Profile</Typography>
        <Typography>Name: {user.name}</Typography>
        <Typography>Email: {user.email}</Typography>
        <TextField label="New Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleChangePassword}>Change Password</Button>
        {message && <Typography color="success.main" mt={2}>{message}</Typography>}
      </Paper>
    </Box>
  );
}
