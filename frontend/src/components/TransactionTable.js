import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, MenuItem } from '@mui/material';

const columns = [
  { field: 'created_at', headerName: 'Date', flex: 1, type: 'dateTime', valueGetter: ({ value }) => value ? new Date(value) : null, sortable: true },
  { field: 'merchant', headerName: 'Merchant', flex: 1.2, sortable: true },
  { field: 'category', headerName: 'Category', flex: 1, sortable: true },
  { field: 'amount', headerName: 'Amount', flex: 1, type: 'number', sortable: true, valueFormatter: ({ value }) => '₹' + value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
  { field: 'method', headerName: 'Method', flex: 0.8, sortable: true },
  { field: 'status', headerName: 'Status', flex: 0.8, sortable: true },
  { field: 'location', headerName: 'Location', flex: 1.2, sortable: false },
];

export default function TransactionTable({ transactions }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const categories = Array.from(new Set(transactions.map(tx => tx.category)));

  const filtered = transactions.filter(tx => {
    return (
      (!search || (tx.merchant_details?.name || tx.description).toLowerCase().includes(search.toLowerCase())) &&
      (!category || tx.category === category)
    );
  });

  const rows = filtered.map(tx => ({
    id: tx._id,
    created_at: tx.created_at,
    merchant: tx.merchant_details?.name || tx.description,
    category: tx.category,
    amount: tx.amount,
    method: tx.method,
    status: tx.status,
    location: (() => {
      // Try to extract city and country from address_components
      const comps = tx.merchant_details?.address_components;
      let city = '', country = '';
      if (Array.isArray(comps)) {
        for (const comp of comps) {
          if (comp.types?.includes('locality')) city = comp.long_name;
          if (comp.types?.includes('country')) country = comp.long_name;
        }
      }
      if (city && country) return `${city}, ${country}`;
      if (tx.merchant_details?.vicinity) return tx.merchant_details.vicinity;
      return 'N/A';
    })(),
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Search Merchant" value={search} onChange={e => setSearch(e.target.value)} size="small"
          sx={{ input: { color: '#F6F6F6' }, label: { color: '#B2B2B2' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#2D4059' }, '&:hover fieldset': { borderColor: '#00B8A9' } } }}
        />
        <TextField label="Category" select value={category} onChange={e => setCategory(e.target.value)} size="small" sx={{ minWidth: 120,
          input: { color: '#F6F6F6' }, label: { color: '#B2B2B2' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#2D4059' }, '&:hover fieldset': { borderColor: '#00B8A9' } } }}>
          <MenuItem value="">All</MenuItem>
          {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pageSize={8}
        rowsPerPageOptions={[8, 16, 32]}
        disableSelectionOnClick
        sx={{
          background: 'transparent',
          borderRadius: 3,
          fontSize: 16,
          color: '#F6F6F6',
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
          border: '1px solid #2D4059',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#181A20',
            color: '#00B8A9',
            fontWeight: 700,
          },
          '& .MuiDataGrid-row': {
            backgroundColor: '#232526',
            '&:nth-of-type(odd)': {
              backgroundColor: '#262A34',
            },
          },
        }}
      />
    </Box>
  );
}
