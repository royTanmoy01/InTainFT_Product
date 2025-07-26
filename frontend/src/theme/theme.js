import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00B8A9',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F6416C',
    },
    background: {
      default: '#181A20',
      paper: '#232526',
    },
    text: {
      primary: '#F6F6F6',
      secondary: '#B2B2B2',
    },
    chart: {
      palette: [
        '#00B8A9', '#F6416C', '#FFDE7D', '#43D8C9', '#FF8C42', '#6A0572', '#2D4059', '#EA5455',
        '#F07B3F', '#FFD460', '#3EC1D3', '#FF6F3C', '#1FAB89', '#62D2A2', '#F9ED69', '#B83B5E'
      ]
    }
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: '#232526',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#232526',
          color: '#F6F6F6',
          borderRadius: 12,
          border: '1px solid #2D4059',
        },
        columnHeaders: {
          backgroundColor: '#181A20',
          color: '#00B8A9',
          fontWeight: 700,
        },
        row: {
          '&:nth-of-type(even)': {
            backgroundColor: '#232526',
          },
          '&:nth-of-type(odd)': {
            backgroundColor: '#262A34',
          },
        },
      },
    },
  },
});

export default theme;
