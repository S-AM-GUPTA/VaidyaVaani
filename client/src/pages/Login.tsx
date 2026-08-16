import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, KeyRound, Loader2, Sparkles } from 'lucide-react';
import { ConstellationCanvas } from '../components/ConstellationCanvas';
import Logo from '../components/Logo';

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
      setError(err.response?.data?.error || 'Failed to request security code');
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
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#000000] text-[#ffffff] font-sans selection:bg-[#8052ff] selection:text-[#ffffff] relative overflow-hidden">
      
      {/* Background 3D Ambient Constellation */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
        <ConstellationCanvas variant="ambient" particleCount={110} interactive={false} />
      </div>

      {/* Left Side — 3D Visual & Brand Manifesto */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 z-10 border-r border-white/[0.06]">
        
        {/* Top Logo Lockup */}
        <div className="w-full">
          <Logo size="lg" />
        </div>

        {/* Center Live 3D Neural Brain Graphic */}
        <div className="my-auto w-full max-w-md mx-auto relative flex items-center justify-center p-4">
          <div className="absolute w-[260px] h-[260px] rounded-full bg-[#8052ff]/20 blur-[100px] pointer-events-none"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full bg-[#00d2d3]/20 blur-[90px] pointer-events-none"></div>
          <img 
            src="/images/brain-neural-model.png" 
            alt="3D Neural Brain Intelligence" 
            className="w-full h-auto object-contain rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(128,82,255,0.25)]"
          />
        </div>

        {/* Bottom Headline & Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00d2d3] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00d2d3]" />
            Encrypted Knowledge Vault
          </div>
          
          <h1 className="text-4xl font-normal text-[#ffffff] tracking-[-0.04em] leading-[1.08] mb-4">
            Command your clinical records in one space.
          </h1>
          <p className="text-sm font-light text-[#bdbdbd] leading-relaxed">
            Decipher lab biomarkers, review prescription timelines, and ask questions through private, zero-knowledge inference.
          </p>
        </motion.div>
      </div>

      {/* Right Side — Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-28 relative z-10">
        
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Logo size="sm" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-left">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8052ff] mb-2">
              Authentication
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#ffffff] tracking-[-0.04em] mb-2">
              Welcome back.
            </h2>
            <p className="text-sm font-light text-[#9a9a9a]">
              Enter your email to receive an instant authentication key.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-300 rounded-2xl text-xs font-light flex items-center gap-3"
            >
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {step === 1 ? (
            <form onSubmit={requestOTP} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#9a9a9a]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 bg-white/[0.03] border border-white/10 rounded-full focus:border-[#8052ff] focus:ring-1 focus:ring-[#8052ff] focus:outline-none transition-all font-light text-[#ffffff] placeholder:text-[#9a9a9a]/60 text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#8052ff] hover:bg-[#6c3df5] text-white font-semibold text-xs uppercase tracking-[0.025em] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(128,82,255,0.3)] flex items-center justify-center group active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                    Dispatching Code...
                  </>
                ) : (
                  <>
                    Continue with Email
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={verifyOTP} 
              className="space-y-6"
            >
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
                    Security Code
                  </label>
                  <button 
                    type="button"
                    className="text-xs font-light text-[#ffb829] hover:underline" 
                    onClick={() => setStep(1)}
                  >
                    Change email
                  </button>
                </div>
                
                <p className="text-xs font-light text-[#9a9a9a] mb-4">
                  Sent to <span className="font-normal text-[#ffffff]">{email}</span>
                </p>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-[#9a9a9a]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 bg-white/[0.03] border border-white/10 rounded-full focus:border-[#8052ff] focus:ring-1 focus:ring-[#8052ff] focus:outline-none transition-all text-center tracking-[0.5em] text-xl font-normal text-[#ffffff] uppercase placeholder:tracking-normal placeholder:font-light placeholder:text-xs"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#8052ff] hover:bg-[#6c3df5] text-white font-semibold text-xs uppercase tracking-[0.025em] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(128,82,255,0.3)] flex items-center justify-center active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                    Authenticating...
                  </>
                ) : 'Verify Code & Enter'}
              </button>
            </motion.form>
          )}

          <div className="mt-12 text-center text-xs font-light text-[#9a9a9a]">
            Protected by Zero-Knowledge Encryption • <Link to="/" className="text-[#8052ff] hover:underline">Return to Home</Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
