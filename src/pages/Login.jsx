import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';

export default function Login() {
  const { loginWithGoogle, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      console.error('Google login failed:', err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Welcome to CampusLens
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Sign in with your Google account to get started
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error('Login Failed')}
            width={300}
          />
        </div>
      </div>
    </div>
  );
}
