import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/MainTool/Login';
import Protected from './pages/MainTool/Protected';
import Signup from './pages/MainTool/Signup';
import Tool from './pages/MainTool/Tool';
import MapCreation from './pages/MainTool/MapCreation'; // Importe o componente MapCreation
import ProtectedRoute from './pages/MainTool/ProtectedRoute'; // Importe o componente de rota protegida

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected />} />
          <Route
            path="/home/:id_mapa"
            element={
              <ProtectedRoute>
                <Tool />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
