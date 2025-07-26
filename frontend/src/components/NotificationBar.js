import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Snackbar, 
  Alert, 
  AlertTitle, 
  IconButton, 
  Grow, 
  Stack,
  Avatar,
  Typography,
  Chip
} from '@mui/material';
import { 
  Close, 
  TrendingUp, 
  TrendingDown, 
  Warning, 
  CheckCircle, 
  Info,
  Lightbulb
} from '@mui/icons-material';

export default function NotificationBar({ notifications = [], onDismiss }) {
  const [openNotifications, setOpenNotifications] = useState({});

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      notifications.forEach((notification, index) => {
        if (!openNotifications[notification.id]) {
          setTimeout(() => {
            setOpenNotifications(prev => ({
              ...prev,
              [notification.id]: true
            }));
          }, index * 300);
        }
      });
    }
  }, [notifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <TrendingDown />;
      case 'info': return <Info />;
      case 'budget': return <TrendingUp />;
      case 'insight': return <Lightbulb />;
      default: return <Info />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)';
      case 'warning': return 'linear-gradient(135deg, #ff8a00 0%, #ffb347 100%)';
      case 'error': return 'linear-gradient(135deg, #ff416c 0%, #ff4757 100%)';
      case 'info': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'budget': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'insight': return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getSeverity = (type) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 420
      }}
    >
      <Stack spacing={2}>
        {notifications && notifications.length > 0 ? notifications.map((notification) => (
          <Grow
            key={notification.id}
            in={openNotifications[notification.id]}
            timeout={600}
          >
            <Box>
              <Alert
                severity={getSeverity(notification.type)}
                onClose={() => onDismiss(notification.id)}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)`,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                  position: 'relative',
                  minWidth: 350,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: getColor(notification.type)
                  },
                  '& .MuiAlert-icon': {
                    display: 'none'
                  },
                  '& .MuiAlert-message': {
                    width: '100%',
                    p: 0
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      background: getColor(notification.type),
                      fontSize: '1.2rem'
                    }}
                  >
                    {getIcon(notification.type)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={700}
                        sx={{ 
                          color: '#333',
                          mr: 1
                        }}
                      >
                        {notification.title || 'Notification'}
                      </Typography>
                      
                      {notification.priority === 'high' && (
                        <Chip
                          label="High Priority"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            background: 'linear-gradient(45deg, #ff416c, #ff4757)',
                            color: '#fff',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        lineHeight: 1.4
                      }}
                    >
                      {notification.message}
                    </Typography>
                    
                    {notification.action && (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#667eea',
                            cursor: 'pointer',
                            fontWeight: 600,
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                          onClick={notification.action.handler}
                        >
                          {notification.action.label} →
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Alert>
            </Box>
          </Grow>
        )) : null}
      </Stack>
    </Box>
  );
}
