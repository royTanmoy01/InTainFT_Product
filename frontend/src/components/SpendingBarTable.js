import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function SpendingBarTable({ byMonth }) {
  return (
    <TableContainer component={Paper} sx={{ background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#F6F6F6', borderRadius: 3, mt: 2 }}>
      <Typography variant="h6" fontWeight={700} color="#F6416C" sx={{ p: 2 }}>Monthly Trends Table</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#FFD460', fontWeight: 700 }}>Month</TableCell>
            <TableCell sx={{ color: '#FFD460', fontWeight: 700 }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(byMonth).map(([month, amt]) => (
            <TableRow key={month}>
              <TableCell sx={{ color: '#F6F6F6' }}>{month}</TableCell>
              <TableCell sx={{ color: '#F6F6F6' }}>{amt.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
