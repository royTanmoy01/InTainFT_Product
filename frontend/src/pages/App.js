import React from 'react';
import { Box, Paper, Typography, Button, CircularProgress, Backdrop } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import Profile from './Profile';
import OnboardingModal from '../components/OnboardingModal';
import NotificationBar from '../components/NotificationBar';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import { getToken, clearToken } from '../utils/auth';

// Modern loading screen component
function LoadingScreen() {
  return (
    <Backdrop open={true} sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      zIndex: 9999,
      flexDirection: 'column'
    }}>
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: '#fff',
          mb: 3,
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#fff', 
          fontWeight: 300,
          letterSpacing: 2,
          textTransform: 'uppercase',
          opacity: 0.9
        }}
      >
        Loading SpendWise
      </Typography>
    </Backdrop>
  );
}

function AppContent() {
  const [isAuth, setIsAuth] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [showSessionModal, setShowSessionModal] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(() => !localStorage.getItem('onboarded'));
  const [notification, setNotification] = React.useState({ open: false, message: '', severity: 'info' });
  const location = useLocation();
  const navigate = useNavigate();

  // Enhanced auth check with better error handling
  React.useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      const token = getToken();
      
      if (!token) {
        setIsAuth(false);
        setAuthLoading(false);
        if (location.pathname.startsWith('/dashboard') || location.pathname === '/profile') {
          navigate('/login');
        }
        return;
      }

      try {
        const response = await axios.get('/api/user/me', { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        
        if (response.status === 200) {
          setIsAuth(true);
          if (location.pathname === '/login' || location.pathname === '/register') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearToken();
        setIsAuth(false);
        if (location.pathname.startsWith('/dashboard') || location.pathname === '/profile') {
          navigate('/login');
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // Onboarding modal logic
  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarded', 'true');
    setNotification({ 
      open: true, 
      message: 'Welcome to the future of financial intelligence!', 
      severity: 'success' 
    });
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
      
      {/* Modern Session Modal */}
      {showSessionModal && (
        <Backdrop open={true} sx={{ zIndex: 9999 }}>
          <Paper 
            elevation={24} 
            sx={{ 
              p: 6, 
              minWidth: 400, 
              borderRadius: 6, 
              textAlign: 'center', 
              position: 'relative',
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: '#fff',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Button 
              aria-label="Close" 
              onClick={() => setShowSessionModal(false)} 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                minWidth: 0, 
                width: 40,
                height: 40,
                borderRadius: '50%',
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }}
            >
              ✕
            </Button>
            <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: '#ffeb3b' }}>
              🔐 Session Expired
            </Typography>
            <Typography mb={4} sx={{ opacity: 0.9 }}>
              Your session has expired for security. Please log in again to continue your financial journey.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => { setShowSessionModal(false); navigate('/login'); }}
              sx={{
                background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: '0 8px 32px rgba(255,107,107,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5252, #ff7043)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(255,107,107,0.4)'
                }
              }}
            >
              Continue to Login
            </Button>
          </Paper>
        </Backdrop>
      )}
      
      <OnboardingModal open={showOnboarding} onClose={handleOnboardingClose} />
      <NotificationBar 
        open={notification.open} 
        message={notification.message} 
        severity={notification.severity} 
        onClose={() => setNotification({ ...notification, open: false })} 
      />
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
