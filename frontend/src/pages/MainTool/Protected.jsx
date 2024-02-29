import React from 'react';
import Tool from './Tool'
import { useNavigate, Navigate } from "react-router-dom";


const Protected = () => {
  const token = localStorage.getItem('token');
  
  const navigate = useNavigate();

  return (
    token ? <Tool navigate={navigate} /> : <Navigate to="/login" />
  )

};

export default Protected;