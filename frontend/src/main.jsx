import React from 'react';
import ReactDOM from 'react-dom/client'; // Importe createRoot de 'react-dom/client'
import App from './App.jsx';
import { Toaster } from 'sonner';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
    <Toaster richColors="false" 
    />
  </React.StrictMode>
);
