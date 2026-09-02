import React, { useState } from 'react';
import { useAuth, type ExtraUserDetails } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  Loader2, 
  KeyRound, 
  ShieldCheck, 
  Smartphone,
  Info,
  HeartPulse,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  MapPin,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Login / Common States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Extra Signup Details
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [city, setCity] = useState('');

  // Phone Auth states
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
      navigate('/dashboard');
    } else {
      setError(res.error || 'Google Authentication failed. Please check network connection.');
    }
    setGoogleLoading(false);
  };

  // Email & Password Auth Flow
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    setError('');
    
    if (authMode === 'login') {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    } else {
      const extraDetails: ExtraUserDetails = {
        fullName: fullName.trim(),
        phoneNumber: signupPhone.trim() || undefined,
        age: age ? parseInt(age) : undefined,
        gender,
        bloodGroup,
        city: city.trim() || undefined
      };

      const res = await signupWithEmail(email, password, extraDetails);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Could not create account. Please check details.');
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
    const extraDetails: ExtraUserDetails | undefined = (authMode === 'signup' && fullName) ? {
      fullName: fullName.trim(),
      phoneNumber,
      age: age ? parseInt(age) : undefined,
      gender,
      bloodGroup
    } : undefined;

    const res = await verifyPhoneOtp(otpCode, phoneNumber, extraDetails);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid verification code.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-[#f0fdf4]/40 to-slate-100 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Invisible container for Firebase Phone reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Left Side — Overview & Platform Highlights */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 border-r border-slate-200/80 bg-white/70 backdrop-blur-md">
        
        {/* Top Header & Logo */}
        <div className="w-full flex items-center justify-between">
          <Logo size="lg" theme="light" />

          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </Link>
        </div>

        {/* Center Card */}
        <div className="my-auto w-full max-w-lg mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-emerald-300/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Zero-Knowledge Personal Health Vault
          </div>

          <h1 className="font-headline text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Smart Medicine Savings & Multi-Doctor Safety for Everyone
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-8">
            Manage your family's prescriptions, find generic salt alternatives that save up to 80%, cross-check drug interactions, and decode lab reports in your preferred Indian language.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Private & Encrypted Session</h4>
                <p className="text-xs text-slate-500 mt-0.5">Your medical records and prescriptions stay safe in your private local vault.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 border border-teal-100">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Save Up to 80% on Generic Salts</h4>
                <p className="text-xs text-slate-500 mt-0.5">Compare active salts across top pharmacies and find verified affordable alternatives.</p>
              </div>
            </div>
          </div>

          {/* Clinical Security Badges */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200 text-[11px] font-mono text-slate-500">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">AES-256 Vault</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">7 Regional Dialects</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">100% Free Access</span>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="text-xs text-slate-400 font-mono">
          VaidyaVaani Health & Safety Platform • 2026
        </div>
      </div>

      {/* Right Side — Interactive Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 sm:py-12 lg:px-16 xl:px-20 overflow-y-auto max-h-screen">
        
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
          className="w-full max-w-lg mx-auto doppel-shell shadow-2xl"
        >
          <div className="doppel-core p-7 sm:p-10">
            {/* Header */}
            <div className="mb-6 text-left">
              <div className="haptic-badge bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Secure User Access</span>
              </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              {authMode === 'login' ? 'Sign In to Your Account' : 'Create Your Free Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {authMode === 'login' 
                ? 'Access your prescriptions, generic savings, and lab reports.' 
                : 'Sign up in 30 seconds to track prescriptions and check medicine savings.'}
            </p>
          </div>

          {/* Mode Switcher: Sign In vs Register Tabs */}
          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl mb-5 w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
              }}
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setError('');
              }}
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'signup' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Method Switcher (Email vs Phone) */}
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
              }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'email' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'phone' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile SMS OTP
            </button>
          </div>

          {/* Google One-Tap */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full btn-med-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2.5 mb-5 disabled:opacity-60 cursor-pointer"
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
              {authMethod === 'email' ? 'or use email' : 'or mobile number'}
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* =========================================================
              METHOD 1: EMAIL AUTH (WITH FULL SIGNUP FIELDS)
              ========================================================= */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              
              {/* Extra Details Fields in Signup Mode */}
              <AnimatePresence>
                {authMode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3.5 overflow-hidden"
                  >
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required={authMode === 'signup'}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-sm"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                    </div>

                    {/* Phone & City Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Smartphone className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            type="tel"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-xs font-mono"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                          City / State
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-xs"
                            placeholder="e.g. Delhi"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Age, Gender & Blood Group */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 font-mono">
                          Age
                        </label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none text-xs text-slate-900 font-mono"
                          placeholder="e.g. 28"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 font-mono">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none text-xs text-slate-900 font-medium"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 font-mono">
                          Blood Group
                        </label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none text-xs text-slate-900 font-medium"
                        >
                          <option value="O+ Positive">O+</option>
                          <option value="O- Negative">O-</option>
                          <option value="A+ Positive">A+</option>
                          <option value="A- Negative">A-</option>
                          <option value="B+ Positive">B+</option>
                          <option value="B- Negative">B-</option>
                          <option value="AB+ Positive">AB+</option>
                          <option value="AB- Negative">AB-</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                  Email Address <span className="text-rose-500">*</span>
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
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                  Password <span className="text-rose-500">*</span>
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
                className="w-full btn-med-primary py-3 text-xs font-semibold cursor-pointer shadow-md mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    {authMode === 'login' ? 'Authenticating...' : 'Creating Your Account...'}
                  </>
                ) : (
                  <>
                    {authMode === 'login' ? 'Sign In to Your Account' : 'Create Free Account & Enter Vault'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* =========================================================
              METHOD 2: PHONE SMS OTP AUTH
              ========================================================= */}
          {authMethod === 'phone' && (
            <div>
              {phoneStep === 'number' ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 text-sm"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                      Mobile Phone Number <span className="text-rose-500">*</span>
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
                    <span>Enter code sent to <strong className="text-slate-900 font-mono">{phoneNumber}</strong>.</span>
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

          {/* Footnote */}
          <p className="text-[11px] text-center text-slate-400 mt-6 leading-relaxed">
            Your personal health records are protected with privacy-first standards.
          </p>
        </div>
      </motion.div>
    </div>

    </div>
  );
};

export default Login;
