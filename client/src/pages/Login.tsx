import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Mail, KeyRound, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen flex bg-[#F8F7F4] font-sans text-[#1C2A24] selection:bg-[#133E2B] selection:text-[#F8F7F4]">
      {/* Left Side - Brand/Graphic Area */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#133E2B] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
           <img src="/images/login.png" alt="Medical Intelligence Hub" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#133E2B] via-[#133E2B]/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full">
          <Link to="/">
            <img src="/logo/complete logo.png" alt="VaidyaVaani Logo" className="h-10 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-lg mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-50">Enterprise Grade Security</span>
          </div>
          
          <h1 className="text-4xl lg:text-[56px] font-extrabold text-[#F8F7F4] tracking-tighter leading-[1.05] mb-6">
            Your secure <br/>medical hub.
          </h1>
          <p className="text-lg text-emerald-50/70 font-medium leading-relaxed max-w-md">
            VaidyaVaani uses advanced AI to decipher lab reports and prescriptions, putting you back in control of your health.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative">
        
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/">
            <img src="/logo/complete logo.png" alt="VaidyaVaani Logo" className="h-8 w-auto" />
          </Link>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#133E2B] tracking-tighter mb-3">Welcome back</h2>
            <p className="text-[#2D4238]/70 font-medium">Sign in to access your health vault.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100 flex items-center shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 mr-3 shrink-0 text-red-500" />
              {error}
            </motion.div>
          )}

          {step === 1 ? (
            <form onSubmit={requestOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#1C2A24] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#2D4238]/40" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 bg-white border border-black/5 rounded-2xl focus:ring-4 focus:ring-[#133E2B]/10 focus:border-[#133E2B] focus:outline-none transition-all font-medium text-[#1C2A24] shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#133E2B] text-[#F8F7F4] font-bold rounded-2xl hover:bg-[#0f3223] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#133E2B]/20 hover:shadow-xl hover:shadow-[#133E2B]/30 flex items-center justify-center group active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue with Email
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.form 
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              onSubmit={verifyOTP} 
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-[#1C2A24] mb-2 flex justify-between">
                  <span>Security Code</span>
                  <button 
                    type="button"
                    className="text-[#2D4238]/60 font-bold hover:text-[#133E2B] transition-colors" 
                    onClick={() => setStep(1)}
                  >
                    Change email
                  </button>
                </label>
                <p className="text-sm text-[#2D4238]/70 font-medium mb-4">
                  We sent a 6-digit code to <span className="font-bold text-[#1C2A24]">{email}</span>
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-[#2D4238]/40" />
                  </div>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 bg-white border border-black/5 rounded-2xl focus:ring-4 focus:ring-[#133E2B]/10 focus:border-[#133E2B] focus:outline-none transition-all text-center tracking-[0.5em] text-2xl font-bold text-[#1C2A24] shadow-[0_2px_10px_rgb(0,0,0,0.02)] uppercase placeholder:tracking-normal placeholder:font-medium placeholder:text-base placeholder:text-left"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#133E2B] text-[#F8F7F4] font-bold rounded-2xl hover:bg-[#0f3223] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#133E2B]/20 hover:shadow-xl hover:shadow-[#133E2B]/30 flex items-center justify-center active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Verifying...
                  </>
                ) : 'Verify Code & Sign In'}
              </button>
            </motion.form>
          )}
          
          <div className="mt-12 text-center text-sm font-medium text-[#2D4238]/60">
            By signing in, you agree to our <a href="#" className="font-bold text-[#1C2A24] hover:text-[#133E2B] underline decoration-[#1C2A24]/20 hover:decoration-[#133E2B] transition-all">Terms of Service</a> and <a href="#" className="font-bold text-[#1C2A24] hover:text-[#133E2B] underline decoration-[#1C2A24]/20 hover:decoration-[#133E2B] transition-all">Privacy Policy</a>.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
