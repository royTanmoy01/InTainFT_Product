import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';

import Header from '../components/Header';
import Footer from '../components/Footer';


import { getToken } from '../utils/auth';

  // Move session/token logic into AppContent inside Router
  function AppContent() {
    const [isAuth, setIsAuth] = React.useState(false);
    const [showSessionModal, setShowSessionModal] = React.useState(false);
    const location = useLocation();

    function clearToken() {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }

    React.useEffect(() => {
      const checkToken = async () => {
        const token = getToken();
        if (token) {
          setIsAuth(true);
          setShowSessionModal(false);
        } else {
          // Try refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const res = await axios.post('/api/auth/refresh', { refreshToken });
              if (res.data.token) {
                setToken(res.data.token, refreshToken, 900);
                await axios.post('/api/transactions/import', { from: Math.floor(new Date('2024-07-01').getTime() / 1000), to: Math.floor(new Date('2024-07-17').getTime() / 1000) }, { headers: { Authorization: `Bearer ${res.data.token}` } });
                setIsAuth(true);
                setShowSessionModal(false);
                return;
              }
            } catch (e) {
              clearToken();
              setIsAuth(false);
              if (location.pathname !== '/login') {
                setShowSessionModal(true);
              }
            }
          } else {
            clearToken();
            setIsAuth(false);
            if (location.pathname !== '/login') {
              setShowSessionModal(true);
            }
          }
        }
      };
      checkToken();

      const interval = setInterval(checkToken, 60000);
      return () => clearInterval(interval);
    }, [location.pathname]);

    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
        </Routes>
        <Footer />
        {showSessionModal && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ p: 4, minWidth: 340, borderRadius: 4, textAlign: 'center', position: 'relative' }}>
              {/* Close (cross) icon */}
              <Button aria-label="Close" onClick={() => setShowSessionModal(false)} sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, padding: 0, color: 'grey.700', fontSize: 22, lineHeight: 1 }}>
                &#10005;
              </Button>
              <Typography variant="h6" color="error" fontWeight={700} mb={2}>Session Expired</Typography>
              <Typography mb={2}>Your session has expired. Please log in again.</Typography>
              <Button variant="contained" color="primary" onClick={() => { setShowSessionModal(false); window.location.href = '/login'; }}>Go to Login</Button>
            </Paper>
          </Box>
        )}
      </>
    );
  }

  function App() {
    return (
      <Router>
        <AppContent />
      </Router>
    );
  }

  export default App;
