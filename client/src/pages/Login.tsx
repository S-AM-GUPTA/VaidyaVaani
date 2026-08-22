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
  CheckCircle2,
  HeartPulse
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
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 font-sans selection:bg-sky-600 selection:text-white relative overflow-hidden">
      
      {/* Invisible container for Firebase Phone reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Left Side — Hospital Overview & Patient Security */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 border-r border-slate-200 bg-white">
        
        {/* Top Logo Lockup */}
        <div className="w-full">
          <Logo size="lg" />
        </div>

        {/* Center Patient Guarantee Card */}
        <div className="my-auto w-full max-w-md mx-auto p-8 rounded-2xl bg-sky-50/50 border border-sky-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-sky-800 font-bold mb-4">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            Patient Data Security Standards
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Secure, Encrypted Clinical Portal
          </h3>
          
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            All medical records, prescriptions, and lab biomarkers are decrypted exclusively in your local session. Your personal clinical records are never sold or shared.
          </p>

          <div className="space-y-3 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Multi-Doctor Prescription Cross-Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Regional Language Voice Explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Emergency SOS Medical ID Key</span>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="text-xs text-slate-500">
          VaidyaVaani Healthcare Safety Infrastructure • Version 2.4 (2026)
        </div>
      </div>

      {/* Right Side — Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-[#f8fafc]">
        
        {/* Mobile Header */}
        <div className="mb-8 lg:hidden">
          <Logo size="sm" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
        >
          {/* Header */}
          <div className="mb-6 text-left">
            <div className="med-badge mb-2 font-mono">
              <HeartPulse className="w-3.5 h-3.5" />
              Patient Portal Access
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {authMode === 'login' ? 'Sign in to Patient Portal' : 'Create Your Clinical Vault'}
            </h2>
            <p className="text-xs text-slate-500">
              Access and manage your encrypted health records securely.
            </p>
          </div>

          {/* Quick 1-Click Guest Pass */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGuestEntry}
              className="w-full p-3 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-900 block text-xs">Instant Demo Access (1-Click)</span>
                  <span className="text-[11px] text-slate-600">Explore prescriptions, vitals & lab diagnostics</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Primary Method Switcher (Email vs Phone) */}
          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-lg mb-5 w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
              }}
              className={`w-1/2 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
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
              className={`w-1/2 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'phone' 
                  ? 'bg-sky-600 text-white shadow-xs' 
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
            className="w-full btn-med-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2.5 mb-5 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
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
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">
              {authMethod === 'email' ? 'or email credentials' : 'or phone number'}
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
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
                  className="text-sky-600 hover:underline font-bold"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-sm"
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
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-med-primary py-3 text-xs font-semibold"
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
                      Phone Number with Country Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-sm"
                        placeholder="+91 7985557576"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-med-primary py-3 text-xs font-semibold"
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
                    <label className="text-xs font-bold text-slate-700 font-mono">
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('number')}
                      className="text-xs text-sky-600 hover:underline font-mono font-bold"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg mb-2 flex items-start gap-2 text-xs text-sky-900">
                    <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>Enter code sent to <strong className="text-slate-900 font-mono">{phoneNumber}</strong> (or test code <strong className="text-sky-700 font-mono">123456</strong>).</span>
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none transition-colors font-mono tracking-widest text-center text-lg text-slate-900"
                      placeholder="123456"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-med-primary py-3 text-xs font-semibold"
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

          <div className="mt-6 text-center text-xs text-slate-500">
            Protected by Clinical Encryption • <Link to="/" className="text-sky-600 hover:underline font-bold">Return to Home</Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
