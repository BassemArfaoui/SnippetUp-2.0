import React, { useEffect, useState ,useContext} from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import userContext from '../contexts/userContext';
import WhiteLoadingSpinner from './WhiteLoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [isChecking, setIsChecking] = useState(false);  
  const userContextData=useContext(userContext);

  useEffect(() => {
    const isAuthenticated = async () => {
        try {
          setIsChecking(true);
          const storedData = localStorage.getItem('token');
          if (storedData) {
            const data = JSON.parse(storedData);
            const token = data.token;
            console.log(token);
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

            userContextData.setUser(data.user);
          } else {
            setIsAuth(false);
            setIsChecking(false);
          }
        } catch (err) {
          setIsAuth(false);
          setIsChecking(false);
          setIsChecking(false);
        }
      
        return false;
      };

      isAuthenticated();
  }, []);

  if (isAuth === null || isChecking) {
    return <div className='d-flex justify-content-center align-items-center min-vh-100'><WhiteLoadingSpinner /></div>;
  } 
  else if (isChecking)
  return <div className='d-flex justify-content-center align-items-center min-vh-100'><WhiteLoadingSpinner /></div>;


  return isAuth ? children : <Navigate to="/login" />;
};



export default ProtectedRoute;
