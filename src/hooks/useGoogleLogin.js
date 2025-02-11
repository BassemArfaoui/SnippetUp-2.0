// useGoogleLogin.js
import { useState } from 'react';
import axios from 'axios';
import { useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';
import { notify } from '../components/tools/CustomToaster';

const useCustomGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSuccess = async (credential) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/google-login', { credential });
      const item = response.data;
      console.log(item);
      
      // Save the response (e.g. JWT token) as a JSON string in localStorage.
      localStorage.setItem('token', JSON.stringify(item));
      
      setLoading(false);
      window.location.href = "/";
      console.log('Logged in and token saved to localStorage');
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
      window.location.href = "/login";
      console.error(err);
    }
  };

  const handleLoginError = () => {
    notify('Login failed. Please try again.');
    window.location.href = "/login";
  };

  // Use One Tap login from the library.
  // IMPORTANT: Do not pass any option to disable FedCM.
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      handleLoginSuccess(credentialResponse.credential);
    },
    onError: handleLoginError,
  });

  return {
    loading,
    error,
    googleLogin: handleLoginSuccess,
    googleLogout: () => {
      googleLogout();
      localStorage.removeItem('token');
    },
  };
};

export default useCustomGoogleLogin;
