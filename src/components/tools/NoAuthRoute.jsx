import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import WhiteLoadingSpinner from './WhiteLoadingSpinner';

const NotAuthRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [isChecking, setIsChecking] = useState(false);  


  useEffect(() => {
    const isAuthenticated = async () => {
        try {
            setIsChecking(true);

          const storedData = localStorage.getItem('token');
          if (storedData) {
            const data = JSON.parse(storedData);
            const token = data?.token;
            const response = await axios.get('http://localhost:4000/check/token', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setIsChecking(false);

            if (response.data.valid) {
              setIsAuth(true);
            } else {
              setIsAuth(false);
            }
          } else {
            setIsAuth(false);
            setIsChecking(false);

          }
        } catch (err) {
          setIsAuth(false);
          setIsChecking(false);

        }
      
        return false;
      };

      isAuthenticated();
  }, []);

  if (isAuth === null) {
    return <div className='d-flex justify-content-center align-items-center min-vh-100'><WhiteLoadingSpinner/></div>;
  }

  return !isAuth ? children : <Navigate to="/" />;
};



export default NotAuthRoute;
