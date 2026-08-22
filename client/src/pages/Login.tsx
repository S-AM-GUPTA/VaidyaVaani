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
  Smartphone,
  Info,
  CheckCircle2,
  HeartPulse,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    verifyPhoneOtp
  } = useAuth();
  
  const navigate = useNavigate();

  // Google Sign-In via Firebase
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    const res = await loginWithGoogle();
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.error || 'Google Authentication failed. Please check network connectivity.');
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
      setError('Please enter a valid phone number with country code (e.g. +91 9876543210).');
      return;
    }

    setLoading(true);
    setError('');
    const res = await sendPhoneOtp(phoneNumber, 'recaptcha-container');
    if (res.success) {
      setPhoneStep('otp');
    } else {
      setError(res.error || 'Failed to send SMS verification code.');
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
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      
      {/* Invisible container for Firebase Phone reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Left Side — Clinical Overview & Security */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 border-r border-slate-200 bg-white">
        
        {/* Top Header & Logo */}
        <div className="w-full flex items-center justify-between">
          <Logo size="lg" theme="light" />

          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center Patient Guarantee Card */}
        <div className="my-auto w-full max-w-md mx-auto p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-800 font-bold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero-Knowledge Clinical Architecture
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            Secure, Client-Decrypted Patient Portal
          </h3>
          
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            All medical records, prescriptions, and lab biomarkers are encrypted. Your personal clinical records are protected with bank-grade privacy standards.
          </p>

          <div className="space-y-3.5 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Generic Salt Alternatives (Up to 80% Savings)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Multi-Doctor Pharmacopeia Interaction Radar</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>7 Indian Regional Language Voice Guidance</span>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="text-xs text-slate-400 font-mono">
          VaidyaVaani Healthcare Safety Infrastructure • Version 2.4 (2026)
        </div>
      </div>

      {/* Right Side — Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 sm:py-12 lg:px-16 xl:px-24 bg-[#f8fafc]">
        
        {/* Mobile Header */}
        <div className="mb-6 lg:hidden flex items-center justify-between">
          <Logo size="sm" theme="light" />
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 font-mono font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md mx-auto bg-white p-7 sm:p-10 rounded-3xl border border-slate-200 shadow-sm"
        >
          {/* Header */}
          <div className="mb-6 text-left">
            <div className="med-badge mb-2 font-mono">
              <HeartPulse className="w-3.5 h-3.5" />
              Patient Portal Access
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              {authMode === 'login' ? 'Sign in to Patient Portal' : 'Create Your Health Vault'}
            </h2>
            <p className="text-xs text-slate-500">
              Access and manage your encrypted health records securely.
            </p>
          </div>

          {/* Primary Method Switcher (Email vs Phone) */}
          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl mb-5 w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
              }}
              className={`w-1/2 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'email' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
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
              className={`w-1/2 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'phone' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
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
            className="w-full btn-med-secondary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2.5 mb-5 disabled:opacity-60 cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.4C.7 9.8 0 12.4 0 15.3s.7 5.5 1.9 7.9l3.7-2.9c0-.2 0-.4 0-.6z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">
              {authMethod === 'email' ? 'or email credentials' : 'or mobile number'}
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* METHOD 1: EMAIL & PASSWORD AUTH */}
          {authMethod === 'email' && (
            <div>
              <div className="flex justify-between items-center mb-3 text-xs">
                <span className="text-slate-500">
                  {authMode === 'login' ? "New patient?" : "Already registered?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setError('');
                  }}
                  className="text-emerald-700 hover:underline font-bold cursor-pointer"
                >
                  {authMode === 'login' ? 'Register Account' : 'Sign In'}
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-sm"
                      placeholder="patient@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-med-primary py-3 text-xs font-semibold cursor-pointer"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Smartphone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors font-mono text-sm text-slate-900 placeholder:text-slate-400"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                      Include country code (e.g. +91 for India).
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-med-primary py-3 text-xs font-semibold cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Sending Verification Code...
                      </>
                    ) : (
                      <>
                        Send 6-Digit SMS Code
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 font-mono">
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('number')}
                      className="text-xs text-emerald-700 hover:underline font-mono font-bold cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-2 flex items-start gap-2 text-xs text-emerald-900">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Enter the 6-digit SMS verification code sent to <strong className="text-slate-900 font-mono">{phoneNumber}</strong>.</span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors font-mono tracking-widest text-center text-lg text-slate-900"
                      placeholder="123456"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-med-primary py-3 text-xs font-semibold cursor-pointer"
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

          {/* Privacy Note */}
          <p className="text-[11px] text-center text-slate-400 mt-6 leading-relaxed">
            By signing in, you verify that clinical records decrypted in this session are processed strictly under zero-knowledge encryption protocols.
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
