import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email });
      setSessionId(res.data.sessionId);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/verify`, { sessionId, otp });
      login(res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-[var(--color-border)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-medical-blue)]">VaidyaVaani</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Sign in to your health vault</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-[var(--color-status-error)] rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={requestOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-medical-blue)] focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[var(--color-medical-blue)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Enter OTP sent to {email}
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-medical-blue)] focus:outline-none transition-colors text-center tracking-widest text-lg"
                placeholder="------"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[var(--color-medical-blue)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 px-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-colors text-sm"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
