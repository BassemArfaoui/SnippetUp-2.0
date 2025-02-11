// GoogleLogin.js
import React from 'react';
import { GoogleLogin as GoogleLoginButton } from '@react-oauth/google';
import useCustomGoogleLogin from '../../hooks/useGoogleLogin';

function GoogleLogin() {
  const { loading, error, googleLogin: customGoogleLogin, googleLogout } = useCustomGoogleLogin();

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <GoogleLoginButton
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse.credential);
            customGoogleLogin(credentialResponse.credential);
          }}
          onError={() => {
            console.error('error');
            window.location.href = "/login";
          }}
        />
      )}
      
      {error && <p>{error}</p>}
      
      <button onClick={googleLogout}>Logout</button>
    </div>
  );
}

export default GoogleLogin;
