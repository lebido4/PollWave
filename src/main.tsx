import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { PollProvider } from './contexts/PollContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PollProvider>
          <App />
        </PollProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);