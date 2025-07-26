import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Grid, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Snackbar, Alert } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { PieChart, TableChart, BarChart, Home, Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Logout, Download, Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { clearToken, getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { SpendingPie, SpendingBar } from './SpendingCharts';
import PaymentMethodChart from './PaymentMethodChart';
import GeoMap from './GeoMap';
import Recommendations from './Recommendations';
import BudgetTracker from './BudgetTracker';
import TransactionTable from './TransactionTable';

function formatCurrency(amount) {
  return '₹' + (amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
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
    { label: 'Dashboard', icon: <Home />, section: 'dashboard' },
    { label: 'Spending Charts', icon: <PieChart />, section: 'charts' },
    { label: 'Trends', icon: <BarChart />, section: 'trends' },
    { label: 'Geographic Analysis', icon: <PieChart />, section: 'geo' },
    { label: 'Transactions', icon: <TableChart />, section: 'table' },
    { label: 'Logout', icon: <LogoutIcon />, section: 'logout' },
  ];

  const handleImport = async () => {
    setImporting(true);
    setError('');
    try {
      // Use UNIX timestamps for Razorpay API
      const from = Math.floor(new Date('2024-07-01').getTime() / 1000);
      const to = Math.floor(new Date('2024-07-17').getTime() / 1000);
      await axios.post('/api/transactions/import', { from, to }, { headers: { Authorization: `Bearer ${getToken()}` } });
      await fetchData();
    } catch (err) {
      setError('Import failed');
    }
    setImporting(false);
  };

  const handleExport = async () => {
    setError('');
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
    } catch (err) {
      setError('Export failed');
    }
  };

  const handleClear = async () => {
    setClearing(true);
    setError('');
    try {
      await axios.post('/api/transactions/clear', {}, { headers: { Authorization: `Bearer ${getToken()}` } });
      setSuccess('All transactions cleared!');
      await fetchData();
    } catch (err) {
      setError('Failed to clear data');
    }
    setClearing(false);
  };
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181A20 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar with icon, title, and hamburger */}
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #232526 0%, #2D4059 100%)', px: 2, py: 1, mb: 2 }}>
        <SavingsIcon sx={{ mr: 2, fontSize: 32, color: '#FFD460' }} />
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 2, color: '#FFD460' }}>
          SpendWise Dashboard
        </Typography>
        <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)} sx={{ ml: 2 }}>
          <MenuIcon sx={{ fontSize: 32, color: '#FFD460' }} />
        </IconButton>
      </Box>
      {/* Main content and right-side drawer */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ flexGrow: 1, px: { xs: 1, md: 4 }, py: 2, maxWidth: '1600px', margin: '0 auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
          ) : (
            <>
              {/* Dashboard Section */}
              {selectedSection === 'dashboard' && (
                <Grid container spacing={4} alignItems="stretch">
                  <Grid item xs={12} md={4} lg={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                      {analysis && <SpendingPie byCategory={analysis.byCategory} />}
                      {transactions.length > 0 && <PaymentMethodChart transactions={transactions} />}
                      {analysis && <BudgetTracker analysis={analysis} />}
                      <Recommendations />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8} lg={8}>
                    <Paper elevation={4} sx={{ p: 3, background: 'linear-gradient(135deg, #232526 0%, #262A34 100%)', color: '#F6F6F6', height: '100%' }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button color="primary" variant="contained" startIcon={<Add />} onClick={handleImport} disabled={importing} sx={{ mr: 1 }}>
                          {importing ? 'Importing...' : 'Import'}
                        </Button>
                        <Button color="secondary" variant="contained" startIcon={<Delete />} onClick={handleClear} disabled={clearing} sx={{ mr: 1 }}>
                          {clearing ? 'Clearing...' : 'Clear Data'}
                        </Button>
                        <Button color="info" variant="contained" startIcon={<Download />} onClick={handleExport} sx={{ mr: 1 }}>
                          Export CSV
                        </Button>
                        <Button color="error" variant="contained" startIcon={<Logout />} onClick={handleLogout}>
                          Logout
                        </Button>
                      </Box>
                      <Typography variant="h6" fontWeight={700} color="#F6416C" mb={2}>Transaction History</Typography>
                      <TransactionTable transactions={transactions} />
                      {analysis?.anomalies?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography color="error" fontWeight={700}>Anomalies Detected:</Typography>
                          {analysis.anomalies.map(tx => (
                            <Typography key={tx._id} color="error" fontSize={14}>
                              {tx.merchant_details?.name || tx.description} - {formatCurrency(tx.amount)} on {new Date(tx.created_at).toLocaleString()}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {error && <Typography color="error" mt={2}>{error}</Typography>}
                      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>{success}</Alert>
                      </Snackbar>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              {/* Charts Section */}
              {selectedSection === 'charts' && (
                <Grid container spacing={4} alignItems="stretch">
                  <Grid item xs={12} md={6}>
                    {analysis && <SpendingPie byCategory={analysis.byCategory} />}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {transactions.length > 0 && <PaymentMethodChart transactions={transactions} />}
                  </Grid>
                </Grid>
              )}
              {/* Trends Section */}
              {selectedSection === 'trends' && (
                <Grid container spacing={4} alignItems="stretch">
                  <Grid item xs={12} md={12}>
                    {analysis && <SpendingBar byMonth={analysis.byMonth} />}
                  </Grid>
                </Grid>
              )}
              {/* Geographic Analysis Section */}
              {selectedSection === 'geo' && (
                <Grid container spacing={4} alignItems="stretch">
                  <Grid item xs={12}>
                    <GeoMap transactions={transactions} />
                  </Grid>
                </Grid>
              )}
              {/* Table Section */}
              {selectedSection === 'table' && (
                <Grid container spacing={4} alignItems="stretch">
                  <Grid item xs={12}>
                    <Paper elevation={4} sx={{ p: 3, background: 'linear-gradient(135deg, #232526 0%, #262A34 100%)', color: '#F6F6F6' }}>
                      <Typography variant="h6" fontWeight={700} color="#F6416C" mb={2}>Transaction History</Typography>
                      <TransactionTable transactions={transactions} />
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Box>
        <Drawer
          anchor="right"
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: 220,
              background: 'linear-gradient(135deg, #232526 0%, #262A34 100%)',
              color: '#F6F6F6',
              borderLeft: '1px solid #2D4059',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <List sx={{ width: '100%' }}>
              {navItems.map((item) => (
                <ListItem button key={item.section} selected={selectedSection === item.section}
                  onClick={() => {
                    if (item.section === 'logout') handleLogout();
                    else {
                      setSelectedSection(item.section);
                      setDrawerOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    mx: 2,
                    background: selectedSection === item.section ? 'rgba(0,184,169,0.15)' : 'none',
                    color: selectedSection === item.section ? '#00B8A9' : '#F6F6F6',
                    fontWeight: selectedSection === item.section ? 700 : 500,
                    justifyContent: 'center',
                    minHeight: 56,
                  }}
                >
                  <ListItemIcon sx={{ color: selectedSection === item.section ? '#00B8A9' : '#F6F6F6', minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} sx={{ textAlign: 'left' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}
