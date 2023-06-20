import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import store from './redux/store';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <HelmetProvider>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router />
              </ThemeProvider>
            </LocalizationProvider>

          </BrowserRouter>
        </HelmetProvider>
      </SnackbarProvider>
    </Provider>
  );
}
