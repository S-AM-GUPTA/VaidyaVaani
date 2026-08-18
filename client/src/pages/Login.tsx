import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  Loader2, 
  Sparkles, 
  KeyRound, 
  ShieldCheck, 
  Phone, 
  Smartphone,
  Zap
} from 'lucide-react';
import { ConstellationCanvas } from '../components/ConstellationCanvas';
import Logo from '../components/Logo';

const Login = () => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'number' | 'otp'>('number');

  // Loading & Error states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { 
    loginWithGoogle, 
    loginWithEmail, 
    signupWithEmail, 
    sendPhoneOtp, 
    verifyPhoneOtp,
    loginAsGuest 
  } = useAuth();
  
  const navigate = useNavigate();

  // 1-Click Guest Login
  const handleGuestEntry = () => {
    loginAsGuest();
    navigate('/home');
  };

  // Google Sign-In via Firebase / Hybrid
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    const res = await loginWithGoogle();
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.error || 'Google Authentication failed.');
    }
    setGoogleLoading(false);
  };

  // Email & Password Auth via Firebase / Hybrid
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    if (authMode === 'login') {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        navigate('/home');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    } else {
      const res = await signupWithEmail(email, password);
      if (res.success) {
        navigate('/home');
      } else {
        setError(res.error || 'Could not create account.');
      }
    }
    setLoading(false);
  };

  // Phone OTP Flow via Firebase / Hybrid
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number with country code (e.g. +91 9876543210).');
      return;
    }

    setLoading(true);
    setError('');
    const res = await sendPhoneOtp(phoneNumber, 'recaptcha-container');
    if (res.success) {
      setPhoneStep('otp');
    } else {
      setError(res.error || 'Failed to dispatch SMS verification code.');
    }
    setLoading(false);
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit SMS verification code.');
      return;
    }

    setLoading(true);
    setError('');
    const res = await verifyPhoneOtp(otpCode);
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.error || 'Invalid verification code.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#000000] text-[#ffffff] font-sans selection:bg-[#004fdc] selection:text-[#ffffff] relative overflow-hidden">
      
      {/* Invisible container for Firebase Phone reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Background 3D Ambient Constellation */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <ConstellationCanvas variant="ambient" particleCount={90} interactive={false} />
      </div>

      {/* Left Side — 3D Visual & Brand Manifesto */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 z-10 border-r border-white/[0.06]">
        
        {/* Top Logo Lockup */}
        <div className="w-full">
          <Logo size="lg" />
        </div>

        {/* Center Live 3D Neural Brain Graphic */}
        <div className="my-auto w-full max-w-md mx-auto relative flex items-center justify-center p-4">
          <div className="absolute w-[260px] h-[260px] rounded-full bg-[#004fdc]/25 blur-[100px] pointer-events-none"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full bg-[#00d2d3]/20 blur-[90px] pointer-events-none"></div>
          <img 
            src="/images/brain-neural-model.png" 
            alt="3D Neural Brain Intelligence" 
            className="w-full h-auto object-contain rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,79,220,0.3)]"
          />
        </div>

        {/* Bottom Headline & Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#004fdc] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#004fdc]" />
            Secure Patient Intelligence Vault
          </div>
          
          <h1 className="text-4xl font-normal text-[#ffffff] tracking-[-0.04em] leading-[1.08] mb-4">
            Command your clinical records in one space.
          </h1>
          <p className="text-sm font-light text-[#bdbdbd] leading-relaxed">
            Decipher lab biomarkers, review prescription timelines, and ask questions through private, encrypted clinical AI.
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
          {/* Header */}
          <div className="mb-6 text-left">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#004fdc] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#004fdc]" />
              Patient Authentication
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#ffffff] tracking-[-0.04em] mb-2">
              {authMode === 'login' ? 'Sign in to Vault.' : 'Create your Vault.'}
            </h2>
            <p className="text-sm font-light text-[#9a9a9a]">
              Authenticate to sync and manage your encrypted clinical records.
            </p>
          </div>

          {/* Quick 1-Click Guest Pass */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGuestEntry}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#004fdc]/20 to-[#00d2d3]/20 hover:from-[#004fdc]/30 hover:to-[#00d2d3]/30 border border-[#004fdc]/40 text-white text-xs font-medium flex items-center justify-between transition-all group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#004fdc] flex items-center justify-center text-white">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-white block">Instant Access (1-Click Entry)</span>
                  <span className="text-[11px] text-[#9a9a9a]">Explore workspace, vitals & lab diagnostics instantly</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#004fdc] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Primary Method Switcher (Email vs Phone) */}
          <div className="flex p-1 bg-white/[0.04] border border-white/10 rounded-full mb-6 w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
              }}
              className={`w-1/2 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'email' 
                  ? 'bg-[#004fdc] text-white shadow-[0_0_15px_rgba(0,79,220,0.35)]' 
                  : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setError('');
              }}
              className={`w-1/2 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'phone' 
                  ? 'bg-[#004fdc] text-white shadow-[0_0_15px_rgba(0,79,220,0.35)]' 
                  : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Phone SMS OTP
            </button>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3.5 px-6 rounded-full bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/15 hover:border-white/30 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm mb-6 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#004fdc]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.4C.7 9.8 0 12.4 0 15.3s.7 5.5 1.9 7.9l3.7-2.9c0-.2 0-.4 0-.6z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z"/>
              </svg>
            )}
            <span>Sign In with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/[0.08]"></div>
            <span className="px-3 text-[10px] uppercase font-mono text-[#9a9a9a] tracking-widest">
              {authMethod === 'email' ? 'or email authentication' : 'or phone verification'}
            </span>
            <div className="flex-1 border-t border-white/[0.08]"></div>
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

          {/* METHOD 1: EMAIL & PASSWORD AUTH */}
          {authMethod === 'email' && (
            <div>
              {/* Sign In vs Create Account mode toggle */}
              <div className="flex justify-between items-center mb-4 text-xs">
                <span className="text-[#9a9a9a]">
                  {authMode === 'login' ? "Don't have an account yet?" : "Already have an account?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setError('');
                  }}
                  className="text-[#004fdc] hover:underline font-semibold"
                >
                  {authMode === 'login' ? 'Create Account' : 'Sign In'}
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">
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
                      className="w-full pl-11 pr-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-full focus:border-[#004fdc] focus:ring-1 focus:ring-[#004fdc] focus:outline-none transition-all font-light text-[#ffffff] placeholder:text-[#9a9a9a]/60 text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-[#9a9a9a]" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-full focus:border-[#004fdc] focus:ring-1 focus:ring-[#004fdc] focus:outline-none transition-all font-light text-[#ffffff] placeholder:text-[#9a9a9a]/60 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[#004fdc] hover:bg-[#003eb0] text-white font-semibold text-xs uppercase tracking-[0.025em] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,79,220,0.35)] flex items-center justify-center group active:scale-[0.98] mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      {authMode === 'login' ? 'Sign In to Vault' : 'Create Encrypted Account'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* METHOD 2: PHONE SMS OTP AUTH */}
          {authMethod === 'phone' && (
            <div>
              {phoneStep === 'number' ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">
                      Phone Number with Country Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-[#9a9a9a]" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-11 pr-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-full focus:border-[#004fdc] focus:ring-1 focus:ring-[#004fdc] focus:outline-none transition-all font-light text-[#ffffff] placeholder:text-[#9a9a9a]/60 text-sm"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-[#004fdc] hover:bg-[#003eb0] text-white font-semibold text-xs uppercase tracking-[0.025em] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,79,220,0.35)] flex items-center justify-center group active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                        Sending Verification Code...
                      </>
                    ) : (
                      <>
                        Send SMS Verification Code
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
                      6-Digit SMS Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('number')}
                      className="text-xs text-[#ffb829] hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-[#9a9a9a]" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-full focus:border-[#004fdc] focus:ring-1 focus:ring-[#004fdc] focus:outline-none transition-all font-mono tracking-widest text-center text-lg text-[#ffffff] placeholder:text-[#9a9a9a]/60 placeholder:text-xs placeholder:font-sans placeholder:tracking-normal"
                      placeholder="123456"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-[#004fdc] hover:bg-[#003eb0] text-white font-semibold text-xs uppercase tracking-[0.025em] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,79,220,0.35)] flex items-center justify-center active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                        Verifying Code...
                      </>
                    ) : 'Verify Code & Sign In'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-xs font-light text-[#9a9a9a]">
            Protected by Zero-Knowledge Privacy • <Link to="/" className="text-[#004fdc] hover:underline">Return to Home</Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
