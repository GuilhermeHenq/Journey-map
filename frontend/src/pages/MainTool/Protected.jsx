import React from 'react';
import MapCreation from './MapCreation';
import { useNavigate, Navigate } from "react-router-dom";

const Protected = () => {
  const token = localStorage.getItem('token');
  
  const navigate = useNavigate();

  return (
    token ? <MapCreation navigate={navigate} /> : <Navigate to="/login" />
  )

};

export default Protected;
