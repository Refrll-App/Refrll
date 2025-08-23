import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
  const [status, setStatus] = useState({ state: 'verifying', message: 'Verifying your email...' });
  const [countdown, setCountdown] = useState(5);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus({ state: 'error', message: 'Missing verification token' });
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/verify-email?token=${token}`);
        setStatus({ state: 'success', message: res.data.message });
        
        // Start success countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/login');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
  
      } catch (err) {
        setStatus({
          state: 'error',
          message: err.response?.data?.message || 'Email verification failed'
        });
      }
    };

    verifyEmail();
  }, [token, navigate]);

  // Status icon configuration
  const statusIcons = {
    verifying: (
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping"></div>
        <div className="absolute inset-2 rounded-full bg-blue-500"></div>
      </div>
    ),
    success: (
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    )
  };

  // Status colors configuration
  const statusColors = {
    verifying: 'text-blue-600',
    success: 'text-green-600',
    error: 'text-red-600'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            {statusIcons[status.state]}
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Email Verification
          </h1>
          
          <p className={`text-center font-medium mb-6 ${statusColors[status.state]}`}>
            {status.message}
          </p>
          
          {status.state === 'success' && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700">
                Redirecting to login in <span className="font-mono font-bold">{countdown}</span> seconds
              </p>
              <div className="mt-3 h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {status.state === 'error' && (
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Retry Verification
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
        
        <div className="px-8 py-4 bg-gray-50 text-center border-t">
          <p className="text-xs text-gray-500">
            {status.state === 'verifying' 
              ? 'Please wait while we verify your email' 
              : 'Need help? Contact support@example.com'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;