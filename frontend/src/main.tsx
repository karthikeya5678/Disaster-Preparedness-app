import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // The import should be './App', not './App.tsx'
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext'; // Import the AuthProvider

// This is the correct, final structure.
// The AuthProvider must wrap the App component to provide user data to all routes.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);