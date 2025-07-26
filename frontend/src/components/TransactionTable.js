import React, { useState, useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, MenuItem, Button, Chip, Tooltip } from '@mui/material';
import { Download, FileDownload } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import './TransactionTable.css';

const columns = [
  { 
    field: 'created_at', 
    headerName: 'Date', 
    flex: 1, 
    type: 'dateTime', 
    valueGetter: ({ value }) => value ? new Date(value) : null, 
    sortable: true,
    renderCell: ({ value }) => value ? new Date(value).toLocaleDateString('en-IN') : 'N/A'
  },
  { 
    field: 'merchant', 
    headerName: 'Merchant', 
    flex: 1.5, 
    sortable: true,
    renderCell: ({ value }) => (
      <div style={{ fontWeight: 600, color: '#2c3e50' }}>{value || 'Unknown'}</div>
    )
  },
  { 
    field: 'category', 
    headerName: 'Category', 
    flex: 1, 
    sortable: true,
    renderCell: ({ value }) => (
      <Chip 
        label={value || 'Other'} 
        size="small" 
        className="transaction-category"
      />
    )
  },
  { 
    field: 'amount', 
    headerName: 'Amount', 
    flex: 1, 
    type: 'number', 
    sortable: true, 
    renderCell: ({ value }) => (
      <div className={`transaction-amount ${value >= 0 ? 'transaction-amount-positive' : 'transaction-amount-negative'}`}>
        ₹{Math.abs(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </div>
    )
  },
  { 
    field: 'method', 
    headerName: 'Method', 
    flex: 0.8, 
    sortable: true,
    renderCell: ({ value }) => (
      <Chip 
        label={value?.toUpperCase() || 'N/A'} 
        size="small" 
        className={`transaction-method-${value?.toLowerCase()}`}
      />
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    flex: 0.8, 
    sortable: true,
    renderCell: ({ value }) => (
      <Chip 
        label={value?.toUpperCase() || 'UNKNOWN'} 
        size="small" 
        className={`transaction-status-${value?.toLowerCase()}`}
      />
    )
  },
  { 
    field: 'location', 
    headerName: 'Location', 
    flex: 1.2, 
    sortable: false,
    renderCell: ({ value }) => (
      <Tooltip title={value || 'Location not available'}>
        <div className="transaction-location">
          {value || 'N/A'}
        </div>
      </Tooltip>
    )
  },
];

export default function TransactionTable({ transactions = [] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [status, setStatus] = useState('');
  const tableRef = useRef(null);
  
  const categories = Array.from(new Set((transactions || []).map(tx => tx.category).filter(Boolean)));
  const statuses = Array.from(new Set((transactions || []).map(tx => tx.status).filter(Boolean)));

  // Prevent scrollTop error by ensuring element exists and adding delay
  useEffect(() => {
    const resetScroll = () => {
      try {
        if (tableRef.current) {
          const scrollElement = tableRef.current.querySelector('.MuiDataGrid-virtualScroller');
          if (scrollElement && scrollElement.scrollTop !== undefined) {
            scrollElement.scrollTop = 0;
          }
        }
      } catch (error) {
        // Silently handle any scroll errors
        console.debug('Scroll reset skipped:', error.message);
      }
    };
    
    // Add small delay to ensure DOM is ready
    const timeoutId = setTimeout(resetScroll, 100);
    return () => clearTimeout(timeoutId);
  }, [search, category, dateFrom, dateTo, amountMin, amountMax, status]);

  const filtered = (transactions || []).filter(tx => {
    const date = new Date(tx.created_at);
    return (
      (!search || (tx.merchant_details?.name || tx.description).toLowerCase().includes(search.toLowerCase())) &&
      (!category || tx.category === category) &&
      (!status || tx.status === status) &&
      (!dateFrom || date >= new Date(dateFrom)) &&
      (!dateTo || date <= new Date(dateTo)) &&
      (!amountMin || tx.amount >= parseFloat(amountMin)) &&
      (!amountMax || tx.amount <= parseFloat(amountMax))
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
      // Enhanced location parsing for better city/state/country display
      const comps = tx.merchant_details?.address_components;
      let city = '', state = '', country = '';
      
      if (Array.isArray(comps)) {
        for (const comp of comps) {
          if (comp.types?.includes('locality') || comp.types?.includes('sublocality_level_1')) {
            city = comp.long_name;
          }
          if (comp.types?.includes('administrative_area_level_1')) {
            state = comp.short_name || comp.long_name;
          }
          if (comp.types?.includes('country')) {
            country = comp.short_name || comp.long_name;
          }
        }
      }
      
      // Construct location string with available components
      if (city && state && country) {
        return `${city}, ${state}, ${country}`;
      } else if (city && country) {
        return `${city}, ${country}`;
      } else if (state && country) {
        return `${state}, ${country}`;
      } else if (country) {
        return country;
      }
      
      // Fallback to lat/lng conversion or vicinity
      if (tx.merchant_details?.geometry?.location) {
        const { lat, lng } = tx.merchant_details.geometry.location;
        if (lat && lng) {
          return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
      }
      
      if (tx.merchant_details?.vicinity) {
        return tx.merchant_details.vicinity;
      }
      
      return 'Location unavailable';
    })(),
  }));

  function exportCSV() {
    let csv = 'Date,Merchant,Category,Amount,Method,Status,Location\n';
    rows.forEach(row => {
      csv += `${row.created_at},${row.merchant},${row.category},${row.amount},${row.method},${row.status},${row.location}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'transactions.xlsx');
  }

  return (
    <div className="transaction-table-container">
      <div className="transaction-table-filters">
        <TextField 
          label="Search Merchant" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          size="small"
          className="transaction-table-filter-field"
          placeholder="Enter merchant name..."
        />
        <TextField 
          label="Category" 
          select 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          size="small" 
          className="transaction-table-filter-field"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>
        <TextField 
          label="Status" 
          select 
          value={status} 
          onChange={e => setStatus(e.target.value)} 
          size="small" 
          className="transaction-table-filter-field"
        >
          <MenuItem value="">All Statuses</MenuItem>
          {statuses.map(st => <MenuItem key={st} value={st}>{st?.charAt(0).toUpperCase() + st?.slice(1)}</MenuItem>)}
        </TextField>
        <TextField 
          label="Min Amount" 
          type="number" 
          value={amountMin} 
          onChange={e => setAmountMin(e.target.value)} 
          size="small" 
          className="transaction-table-filter-field"
          placeholder="₹0"
        />
        <TextField 
          label="Max Amount" 
          type="number" 
          value={amountMax} 
          onChange={e => setAmountMax(e.target.value)} 
          size="small" 
          className="transaction-table-filter-field"
          placeholder="₹10000"
        />
        <TextField 
          label="From Date" 
          type="date" 
          value={dateFrom} 
          onChange={e => setDateFrom(e.target.value)} 
          size="small" 
          InputLabelProps={{ shrink: true }} 
          className="transaction-table-filter-field"
        />
        <TextField 
          label="To Date" 
          type="date" 
          value={dateTo} 
          onChange={e => setDateTo(e.target.value)} 
          size="small" 
          InputLabelProps={{ shrink: true }} 
          className="transaction-table-filter-field"
        />
      </div>
      
      <div ref={tableRef}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          disableSelectionOnClick
          className="transaction-data-grid"
          disableColumnResize={false}
          disableColumnReorder={false}
          pagination
          hideFooterSelectedRowCount
          components={{
            NoRowsOverlay: () => (
              <div className="transaction-table-empty">
                <div className="transaction-table-empty-icon">📊</div>
                <div>No transactions found</div>
                <div style={{ fontSize: '0.875rem', color: '#999', marginTop: '8px' }}>
                  Try adjusting your filters or import some data
                </div>
              </div>
            ),
          }}
        />
      </div>
      
      <div className="transaction-export-buttons">
        <button className="transaction-export-button" onClick={exportCSV}>
          <Download style={{ fontSize: '16px' }} />
          Export CSV
        </button>
        <button className="transaction-export-button" onClick={exportExcel}>
          <FileDownload style={{ fontSize: '16px' }} />
          Export Excel
        </button>
      </div>
    </div>
  );
}
