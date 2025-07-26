import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadButton({ data, filename, label }) {
  const handleDownload = () => {
    const csvRows = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };
  return (
    <Tooltip title={`Download ${label}`}>
      <IconButton onClick={handleDownload} color="primary">
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  );
}
