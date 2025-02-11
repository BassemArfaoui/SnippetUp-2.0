// useGoogleAuth.js
import { useGoogleLogin } from '@react-oauth/google';
import useCustomGoogleLogin from './useGoogleLogin';

const useGoogleAuth = () => {
  const { loading, error, googleLogin: customGoogleLogin, googleLogout } = useCustomGoogleLogin();

  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      customGoogleLogin(credentialResponse.credential);
    },
    onError: () => {
      window.location.href = "/login";
    },
  });

  return { login, loading, error, googleLogout };
};

export default useGoogleAuth;
