import React from 'react';
import Tool from './Tool'
import { useNavigate, Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Protected = () => {
  const token = secureLocalStorage.getItem('token');
  
  const navigate = useNavigate();

  return (
    token ? <Tool navigate={navigate} /> : <Navigate to="/login" />
  )

};

export default Protected;