import React, { useEffect, useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Lightbulb, Repeat } from '@mui/icons-material';
import axios from 'axios';
import { getToken } from '../utils/auth';
import '../styles/dashboard.css';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [recurring, setRecurring] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const recRes = await axios.get('/api/transactions/recommendations', { headers: { Authorization: `Bearer ${getToken()}` } });
        setRecommendations(recRes.data.recommendations || []);
        setRecurring(recRes.data.recurring || []);
      } catch (e) {
        setRecommendations([]);
        setRecurring([]);
      }
    }
    fetchData();
  }, []);

  return (
    <Paper elevation={4} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', borderRadius: 4 }}>
      <Typography variant="h6" fontWeight={700} color="#FFD460" mb={1} sx={{ letterSpacing: 1 }}>Budget Recommendations</Typography>
      {recommendations.length === 0 ? (
        <Typography color="text.secondary">No recommendations at this time.</Typography>
      ) : (
        <List>
          {recommendations.map((rec, idx) => (
            <ListItem key={idx}>
              <ListItemIcon><Lightbulb sx={{ color: '#FFD460' }} /></ListItemIcon>
              <ListItemText primary={rec} />
            </ListItem>
          ))}
        </List>
      )}
      <Box mt={2}>
        <Typography variant="h6" fontWeight={700} color="#43D8C9" mb={1} sx={{ letterSpacing: 1 }}>Recurring Payments Detected</Typography>
        {recurring.length === 0 ? (
          <Typography color="text.secondary">No recurring payments detected.</Typography>
        ) : (
          <List>
            {recurring.map((tx, idx) => (
              <ListItem key={idx}>
                <ListItemIcon><Repeat sx={{ color: '#43D8C9' }} /></ListItemIcon>
                <ListItemText primary={`${tx.merchant_details?.name || tx.description} - ₹${tx.amount} every ${tx.frequency || 'month'}`} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}
