import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Fade,
  Zoom,
  Skeleton
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  LocationOn,
  Verified,
  Security,
  Notifications,
  Palette,
  Language,
  TrendingUp,
  AccountBalance,
  CreditCard,
  Shield,
  AutoAwesome
} from '@mui/icons-material';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    currency: 'USD',
    language: 'en'
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const ProfileCard = ({ icon, title, children }) => (
    <Zoom in timeout={600}>
      <Card
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mr: 2,
                width: 32,
                height: 32
              }}
            >
              {icon}
            </Avatar>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#333' }}>
              {title}
            </Typography>
          </Box>
          {children}
        </CardContent>
      </Card>
    </Zoom>
  );

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 3 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              mb: 4,
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
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                opacity: 0.1
              }}
            />

            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                fontSize: '3rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '4px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)'
              }}
            >
              {user?.name?.charAt(0) || <Person />}
            </Avatar>

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
              {user?.name || 'User Name'}
            </Typography>

            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              {user?.email}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Chip
                icon={<Verified />}
                label="Verified Account"
                sx={{
                  background: 'linear-gradient(45deg, #56ab2f, #a8e6cf)',
                  color: '#fff',
                  fontWeight: 600
                }}
              />
              <Chip
                icon={<AutoAwesome />}
                label="Premium Member"
                sx={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                  color: '#fff',
                  fontWeight: 600
                }}
              />
            </Box>

            <Button
              variant={editing ? 'outlined' : 'contained'}
              startIcon={editing ? <Cancel /> : <Edit />}
              onClick={() => editing ? setEditing(false) : setEditing(true)}
              sx={{
                mr: 2,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                ...(editing ? {
                  borderColor: '#667eea',
                  color: '#667eea'
                } : {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                })
              }}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>

            {editing && (
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #56ab2f, #a8e6cf)',
                  boxShadow: '0 10px 30px rgba(86, 171, 47, 0.4)'
                }}
              >
                Save Changes
              </Button>
            )}
          </Paper>
        </Fade>

        {/* Content Grid */}
        <Grid container spacing={4}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <ProfileCard icon={<Person />} title="Personal Information">
              {editing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Full Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                  />
                  <TextField
                    label="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                  />
                  <TextField
                    label="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 2, color: '#667eea' }} />
                    <Typography>{user?.email || 'Not provided'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 2, color: '#667eea' }} />
                    <Typography>{user?.phone || 'Not provided'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 2, color: '#667eea' }} />
                    <Typography>{user?.location || 'Not provided'}</Typography>
                  </Box>
                </Box>
              )}
            </ProfileCard>
          </Grid>

          {/* Account Settings */}
          <Grid item xs={12} md={6}>
            <ProfileCard icon={<Security />} title="Account Settings">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }
                      }}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.darkMode}
                      onChange={(e) => setPreferences({...preferences, darkMode: e.target.checked})}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }
                      }}
                    />
                  }
                  label="Dark Mode"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography>Two-Factor Authentication</Typography>
                  <Chip
                    label="Enabled"
                    sx={{
                      background: 'linear-gradient(45deg, #56ab2f, #a8e6cf)',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
            </ProfileCard>
          </Grid>

          {/* Financial Overview */}
          <Grid item xs={12} md={6}>
            <ProfileCard icon={<TrendingUp />} title="Financial Overview">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Connected Accounts</Typography>
                  <Typography fontWeight={600}>3 Banks</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Total Balance</Typography>
                  <Typography fontWeight={600} sx={{ color: '#56ab2f' }}>
                    $12,450.00
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Monthly Budget</Typography>
                  <Typography fontWeight={600}>$3,500.00</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <AccountBalance sx={{ color: '#667eea' }} />
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Last sync: 2 hours ago
                  </Typography>
                </Box>
              </Box>
            </ProfileCard>
          </Grid>

          {/* Security & Privacy */}
          <Grid item xs={12} md={6}>
            <ProfileCard icon={<Shield />} title="Security & Privacy">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Alert 
                  severity="success" 
                  sx={{ 
                    borderRadius: 3,
                    '& .MuiAlert-icon': {
                      color: '#56ab2f'
                    }
                  }}
                >
                  Your account is fully secured with bank-level encryption
                </Alert>
                
                <Button
                  variant="outlined"
                  startIcon={<CreditCard />}
                  sx={{
                    borderRadius: 3,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#5a6fd8',
                      backgroundColor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                >
                  Manage Payment Methods
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Security />}
                  sx={{
                    borderRadius: 3,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#5a6fd8',
                      backgroundColor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                >
                  Privacy Settings
                </Button>
              </Box>
            </ProfileCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
