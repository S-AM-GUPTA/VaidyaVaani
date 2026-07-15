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
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Brand/Graphic Area */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-900 opacity-90"></div>
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/20 blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 animate-fade-in-up">
            <img src="/logo/complete logo dark.png" alt="VaidyaVaani Logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your secure medical intelligence hub.
          </h1>
          <p className="text-lg text-indigo-100 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            VaidyaVaani uses advanced AI to instantly decipher lab reports and handwritten prescriptions, putting you in control of your health data.
          </p>
          
          <div className="mt-16 flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {i === 1 ? '👨‍⚕️' : i === 2 ? '👩‍🔬' : '💊'}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-300">Trusted by health-conscious individuals.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8 lg:hidden">
          <img src="/logo/logo mark.png" alt="VaidyaVaani Logo" className="h-10 w-auto" />
        </div>
        
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium mt-2">Please sign in to your secure vault.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center animate-fade-in-up">
              <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={requestOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all font-medium text-slate-900 shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl hover:shadow-slate-900/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : 'Continue with Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Enter Security Code</span>
                  <span className="text-indigo-600 font-medium cursor-pointer hover:underline" onClick={() => setStep(1)}>Wrong email?</span>
                </label>
                <p className="text-sm text-slate-500 mb-4">We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span></p>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all text-center tracking-[0.5em] text-2xl font-display font-bold text-slate-900 shadow-sm uppercase"
                  placeholder="------"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-primary text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {loading ? 'Verifying...' : 'Verify Code & Sign In'}
              </button>
            </form>
          )}
          
          <div className="mt-12 text-center text-sm font-medium text-slate-500">
            By signing in, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
