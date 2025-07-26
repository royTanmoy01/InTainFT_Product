import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, IconButton, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, CircularProgress, Snackbar, Alert, Card, CardContent,
  Chip, Avatar, Fade, Grow, LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon, PieChart, TableChart, BarChart, TrendingUp,
  AccountCircle, Menu as MenuIcon, Logout as LogoutIcon, Download, Add, Delete,
  AttachMoney, ShoppingCart, Restaurant, LocalGasStation, Movie, Timeline
} from '@mui/icons-material';
import axios from 'axios';
import { clearToken, getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { SpendingPie, SpendingBar } from './SpendingCharts';
import PaymentMethodChart from './PaymentMethodChart';
import GeoMap from './GeoMap';
import Recommendations from './Recommendations';
import BudgetTracker from './BudgetTracker';
import TransactionTable from './TransactionTable';
import '../styles/dashboard.css';

function formatCurrency(amount) {
  return '₹' + (amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

// Modern stat card component
function StatCard({ title, value, subtitle, icon, color, trend }) {
  return (
    <Grow in timeout={800}>
      <Card 
        sx={{ 
          background: '#ffffff',
          border: `2px solid ${color}40`,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 30px ${color}30`,
            borderColor: `${color}60`
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar 
              sx={{ 
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                width: 48,
                height: 48
              }}
            >
              {icon}
            </Avatar>
            {trend && (
              <Chip 
                label={trend} 
                size="small" 
                sx={{ 
                  background: trend.includes('+') ? '#10b981' : '#ef4444',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }} 
              />
            )}
          </Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
}

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, anRes] = await Promise.all([
        axios.get('/api/transactions', { headers: { Authorization: `Bearer ${getToken()}` } }),
        axios.get('/api/transactions/analyze', { headers: { Authorization: `Bearer ${getToken()}` } })
      ]);
      setTransactions(txRes.data);
      setAnalysis(anRes.data);
    } catch (err) {
      setError('Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', icon: <DashboardIcon />, section: 'dashboard', color: '#667eea' },
    { label: 'Analytics', icon: <PieChart />, section: 'charts', color: '#764ba2' },
    { label: 'Trends', icon: <Timeline />, section: 'trends', color: '#f093fb' },
    { label: 'Geography', icon: <BarChart />, section: 'geo', color: '#f5576c' },
    { label: 'Transactions', icon: <TableChart />, section: 'table', color: '#4facfe' },
    { label: 'Profile', icon: <AccountCircle />, section: 'profile', color: '#43e97b' },
  ];

  const handleImport = async () => {
    setImporting(true);
    setError('');
    try {
      const from = Math.floor(new Date('2024-07-01').getTime() / 1000);
      const to = Math.floor(new Date('2024-07-17').getTime() / 1000);
      await axios.post('/api/transactions/import', { from, to }, { 
        headers: { Authorization: `Bearer ${getToken()}` } 
      });
      await fetchData();
      setSuccess('Transactions imported successfully!');
    } catch (err) {
      setError('Import failed');
    }
    setImporting(false);
  };

  const handleExport = async () => {
    try {
      const res = await axios.get('/api/transactions/export', {
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setSuccess('Data exported successfully!');
    } catch (err) {
      setError('Export failed');
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await axios.post('/api/transactions/clear', {}, { 
        headers: { Authorization: `Bearer ${getToken()}` } 
      });
      setSuccess('All transactions cleared!');
      await fetchData();
    } catch (err) {
      setError('Failed to clear data');
    }
    setClearing(false);
  };

  const handleNav = (section) => {
    if (section === 'logout') handleLogout();
    else if (section === 'profile') navigate('/profile');
    else setSelectedSection(section);
    setDrawerOpen(false);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative'
      }}
    >
      {/* Animated background particles */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Modern Header */}
      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          px: 4,
          py: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                mr: 2, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: 48,
                height: 48
              }}
            >
              <AttachMoney />
            </Avatar>
            <Typography 
              variant="h4" 
              fontWeight={800}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              SpendWise
            </Typography>
          </Box>
          
          <IconButton 
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              '&:hover': { 
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'scale(1.05)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>
      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 10, p: 4, flexGrow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} sx={{ color: '#fff' }} />
          </Box>
        ) : (
          <>
            {/* Dashboard Overview */}
            {selectedSection === 'dashboard' && (
              <Fade in timeout={600}>
                <Box>
                  {/* Stats Cards */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                      <StatCard
                        title="Total Spent"
                        value={formatCurrency(analysis?.total || 0)}
                        subtitle="This month"
                        icon={<AttachMoney />}
                        color="#667eea"
                        trend="+12.5%"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <StatCard
                        title="Transactions"
                        value={transactions.length}
                        subtitle="Total count"
                        icon={<ShoppingCart />}
                        color="#764ba2"
                        trend="+8"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <StatCard
                        title="Top Category"
                        value={Object.keys(analysis?.byCategory || {})[0] || 'N/A'}
                        subtitle="Most spending"
                        icon={<Restaurant />}
                        color="#f093fb"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <StatCard
                        title="Avg. Transaction"
                        value={formatCurrency(analysis?.total / transactions.length || 0)}
                        subtitle="Per transaction"
                        icon={<TrendingUp />}
                        color="#f5576c"
                      />
                    </Grid>
                  </Grid>

                  {/* Main Dashboard Content */}
                  <Grid container spacing={4}>
                    {/* Left Column - Charts */}
                    <Grid item xs={12} lg={8}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 4, 
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 6,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          mb: 3
                        }}
                      >
                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleImport}
                            disabled={importing}
                            sx={{
                              background: 'linear-gradient(45deg, #4caf50, #45a049)',
                              borderRadius: 3,
                              px: 3,
                              '&:hover': { transform: 'translateY(-2px)' }
                            }}
                          >
                            {importing ? 'Importing...' : 'Import Data'}
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={handleExport}
                            sx={{
                              background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                              borderRadius: 3,
                              px: 3,
                              '&:hover': { transform: 'translateY(-2px)' }
                            }}
                          >
                            Export CSV
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<Delete />}
                            onClick={handleClear}
                            disabled={clearing}
                            sx={{
                              background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                              borderRadius: 3,
                              px: 3,
                              '&:hover': { transform: 'translateY(-2px)' }
                            }}
                          >
                            {clearing ? 'Clearing...' : 'Clear Data'}
                          </Button>
                        </Box>

                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#333' }}>
                          💳 Recent Transactions
                        </Typography>
                        <TransactionTable transactions={transactions.slice(0, 10)} />
                      </Paper>
                    </Grid>

                    {/* Right Column - Widgets */}
                    <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {analysis && <SpendingPie byCategory={analysis.byCategory} />}
                      {transactions.length > 0 && <PaymentMethodChart transactions={transactions} />}
                      {analysis && <BudgetTracker analysis={analysis} />}
                      <Recommendations />
                    </Grid>
                  </Grid>

                  {/* Anomalies Section */}
                  {analysis?.anomalies?.length > 0 && (
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 4, 
                        mt: 4,
                        background: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                        borderRadius: 6
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#f44336' }}>
                        🚨 Unusual Activity Detected
                      </Typography>
                      {analysis.anomalies.map(tx => (
                        <Typography key={tx._id} sx={{ mb: 1, color: '#d32f2f' }}>
                          • {tx.merchant_details?.name || tx.description} - {formatCurrency(tx.amount)} on {new Date(tx.created_at).toLocaleDateString()}
                        </Typography>
                      ))}
                    </Paper>
                  )}
                </Box>
              </Fade>
            )}

            {/* Analytics Section */}
            {selectedSection === 'charts' && (
              <Fade in timeout={600}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    {analysis && <SpendingPie byCategory={analysis.byCategory} />}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {transactions.length > 0 && <PaymentMethodChart transactions={transactions} />}
                  </Grid>
                </Grid>
              </Fade>
            )}

            {/* Trends Section */}
            {selectedSection === 'trends' && (
              <Fade in timeout={600}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    {analysis && <SpendingBar byMonth={analysis.byMonth} />}
                  </Grid>
                </Grid>
              </Fade>
            )}

            {/* Geography Section */}
            {selectedSection === 'geo' && (
              <Fade in timeout={600}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <GeoMap transactions={transactions} />
                  </Grid>
                </Grid>
              </Fade>
            )}

            {/* Transactions Table */}
            {selectedSection === 'table' && (
              <Fade in timeout={600}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 6,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#333' }}>
                    📊 All Transactions
                  </Typography>
                  <TransactionTable transactions={transactions} />
                </Paper>
              </Fade>
            )}
          </>
        )}
      </Box>
      {/* Modern Sidebar Drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: 320,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
          },
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            sx={{ 
              mb: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Navigation
          </Typography>
          
          <List sx={{ p: 0 }}>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.section}
                selected={selectedSection === item.section}
                onClick={() => handleNav(item.section)}
                sx={{
                  borderRadius: 3,
                  mb: 2,
                  p: 2,
                  background: selectedSection === item.section 
                    ? `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`
                    : 'transparent',
                  border: selectedSection === item.section 
                    ? `2px solid ${item.color}40`
                    : '2px solid transparent',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                    transform: 'translateX(-4px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ListItemIcon sx={{ color: item.color, minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: selectedSection === item.section ? 700 : 500,
                      color: selectedSection === item.section ? item.color : '#666'
                    }
                  }} 
                />
              </ListItem>
            ))}
            
            {/* Logout Button */}
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: 3,
                mt: 3,
                p: 2,
                background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
                  transform: 'translateX(-4px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontWeight: 600, 
                    color: '#fff' 
                  } 
                }} 
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Success/Error Notifications */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess('')} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess('')} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(76, 175, 80, 0.3)'
          }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={4000} 
        onClose={() => setError('')} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          sx={{ 
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(244, 67, 54, 0.3)'
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
