import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { id_mapa } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      if (user && user.uid) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND}/journeyMap/${id_mapa}/owner`);
          const owner = response.data;
          if (owner.uid === user.uid) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error('Error verifying map ownership:', error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    };

    checkPermission();
  }, [id_mapa, user]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
