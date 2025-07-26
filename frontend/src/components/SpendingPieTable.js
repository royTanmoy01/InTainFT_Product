import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function SpendingPieTable({ byCategory }) {
  return (
    <TableContainer component={Paper} sx={{ background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#F6F6F6', borderRadius: 3, mt: 2 }}>
      <Typography variant="h6" fontWeight={700} color="#00B8A9" sx={{ p: 2 }}>Spending Breakdown Table</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#FFD460', fontWeight: 700 }}>Category</TableCell>
            <TableCell sx={{ color: '#FFD460', fontWeight: 700 }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(byCategory).map(([cat, amt]) => (
            <TableRow key={cat}>
              <TableCell sx={{ color: '#F6F6F6' }}>{cat}</TableCell>
              <TableCell sx={{ color: '#F6F6F6' }}>{amt.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
