import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper
          elevation={8}
          sx={{
            p: 4,
            m: 2,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 182, 193, 0.3)',
            textAlign: 'center'
          }}
        >
          <ErrorOutline 
            sx={{ 
              fontSize: 64, 
              color: '#ff6b6b', 
              mb: 2 
            }} 
          />
          
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{ 
              color: '#ff6b6b', 
              mb: 2 
            }}
          >
            Oops! Something went wrong
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666', 
              mb: 3,
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            We encountered an unexpected error. Don't worry, your data is safe. 
            Try refreshing the page or contact support if the problem persists.
          </Typography>

          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              textAlign: 'left',
              '& .MuiAlert-message': {
                fontSize: '0.9rem'
              }
            }}
          >
            <strong>Error Details:</strong> {this.state.error?.message || 'Unknown error occurred'}
          </Alert>
          
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Refresh Page
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
