import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  Loader2, 
  KeyRound, 
  ShieldCheck, 
  Phone, 
  Smartphone,
  Zap,
  Info,
  CheckCircle2
} from 'lucide-react';
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

  // Google Sign-In via Firebase
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

  // Email & Password Auth via Firebase
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

  // Phone OTP Flow
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number with country code (e.g. +91 7985557576).');
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
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    const res = await verifyPhoneOtp(otpCode, phoneNumber);
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.error || 'Invalid verification code.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#090d16] text-[#f8fafc] font-sans selection:bg-[#0d9488] selection:text-white relative overflow-hidden">
      
      {/* Invisible container for Firebase Phone reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Left Side — Clinical Overview & Security Notice */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 border-r border-[#1e293b] bg-[#0c111c]/50">
        
        {/* Top Logo Lockup */}
        <div className="w-full">
          <Logo size="lg" />
        </div>

        {/* Center Live Clinical Guarantee Card */}
        <div className="my-auto w-full max-w-md mx-auto clinical-card p-8 border border-[#1e293b]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-teal-400 font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Zero-Knowledge Patient Protocol
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-3">
            Secure, Private Health Vault
          </h3>
          
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            All medical records, prescriptions, and lab biomarkers are decrypted exclusively in your local session. Your personal clinical records are never sold or shared.
          </p>

          <div className="space-y-2.5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Multi-Doctor Prescription Cross-Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Regional Language Voice Explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Emergency SOS Medical ID Key</span>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="text-xs text-slate-400">
          VaidyaVaani Healthcare Safety Infrastructure • Version 2.4 (2026)
        </div>
      </div>

      {/* Right Side — Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 relative z-10">
        
        {/* Mobile Header */}
        <div className="mb-8 lg:hidden">
          <Logo size="sm" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Header */}
          <div className="mb-6 text-left">
            <div className="clinical-badge mb-3 font-mono">
              <Lock className="w-3.5 h-3.5" />
              Patient Authentication
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-1">
              {authMode === 'login' ? 'Sign in to Patient Portal' : 'Create Your Clinical Vault'}
            </h2>
            <p className="text-xs text-slate-400">
              Access and manage your encrypted health records securely.
            </p>
          </div>

          {/* Quick 1-Click Guest Pass */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGuestEntry}
              className="w-full p-3 rounded-lg bg-[#0f1523] hover:bg-[#131a2b] border border-[#1e293b] text-white text-xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-white block text-xs">Instant Demo Access (1-Click)</span>
                  <span className="text-[11px] text-slate-400">Explore prescriptions, vitals & lab diagnostics directly</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Primary Method Switcher (Email vs Phone) */}
          <div className="flex p-1 bg-[#0f1523] border border-[#1e293b] rounded-lg mb-6 w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
              }}
              className={`w-1/2 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'email' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
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
              className={`w-1/2 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'phone' 
                  ? 'bg-teal-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
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
            className="w-full btn-secondary py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2.5 mb-6 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
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
            <div className="flex-1 border-t border-[#1e293b]"></div>
            <span className="px-3 text-[10px] uppercase font-mono text-slate-400 tracking-widest">
              {authMethod === 'email' ? 'or email credentials' : 'or phone number'}
            </span>
            <div className="flex-1 border-t border-[#1e293b]"></div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* METHOD 1: EMAIL & PASSWORD AUTH */}
          {authMethod === 'email' && (
            <div>
              <div className="flex justify-between items-center mb-4 text-xs">
                <span className="text-slate-400">
                  {authMode === 'login' ? "Don't have an account yet?" : "Already registered?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setError('');
                  }}
                  className="text-teal-400 hover:underline font-medium"
                >
                  {authMode === 'login' ? 'Create Account' : 'Sign In'}
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0f1523] border border-[#1e293b] rounded-lg focus:border-teal-500 focus:outline-none transition-colors text-white placeholder:text-slate-500 text-sm"
                      placeholder="patient@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0f1523] border border-[#1e293b] rounded-lg focus:border-teal-500 focus:outline-none transition-colors text-white placeholder:text-slate-500 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-xs font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      {authMode === 'login' ? 'Sign In to Patient Portal' : 'Register Encrypted Vault'}
                      <ArrowRight className="w-4 h-4 ml-1" />
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
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                      Phone Number with Country Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0f1523] border border-[#1e293b] rounded-lg focus:border-teal-500 focus:outline-none transition-colors text-white placeholder:text-slate-500 text-sm"
                        placeholder="+91 7985557576"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 text-xs font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Sending Verification Code...
                      </>
                    ) : (
                      <>
                        Send SMS Verification Code
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300 font-mono">
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('number')}
                      className="text-xs text-amber-400 hover:underline font-mono"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="p-3 bg-[#0f1523] border border-[#1e293b] rounded-lg mb-2 flex items-start gap-2.5 text-xs text-slate-400">
                    <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Enter code sent to <strong className="text-white font-mono">{phoneNumber}</strong> (or test code <strong className="text-teal-400 font-mono">123456</strong>).</span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0f1523] border border-[#1e293b] rounded-lg focus:border-teal-500 focus:outline-none transition-colors font-mono tracking-widest text-center text-lg text-white placeholder:text-slate-500"
                      placeholder="123456"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 text-xs font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Verifying...
                      </>
                    ) : 'Verify Code & Sign In'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-xs text-slate-400">
            Encrypted by Zero-Knowledge Security • <Link to="/" className="text-teal-400 hover:underline">Return to Home</Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
