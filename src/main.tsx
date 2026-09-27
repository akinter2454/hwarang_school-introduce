import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AppErrorBoundary} from './components/AppErrorBoundary';
import {prepareLocalStorage} from './utils/persistence';
import './index.css';

// Normalize/migrate browser data before React reads it.
// This keeps old or malformed localStorage data from crashing the app.
prepareLocalStorage();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
