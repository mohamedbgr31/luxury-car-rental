"use client"
import { getApiUrl } from '@/lib/api-config';;
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneInput from 'react-phone-input-2';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Navbar from "../components/homepage/navbar";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  // WhatsApp OTP modal state
  const [waOpen, setWaOpen] = useState(false);
  const [waPhone, setWaPhone] = useState('');
  const [waStep, setWaStep] = useState(1); // 1: phone, 2: code
  const [waCode, setWaCode] = useState('');
  const [waMode, setWaMode] = useState('login'); // 'login' | 'signup'

  // Helper to validate Algerian phone numbers
  function isValidAlgerianPhone(phone) {
    // Remove spaces and dashes
    const clean = phone.replace(/\D/g, '');
    // Should start with 213 and have 9 digits after
    return clean.startsWith('213') && clean.length === 12;
  }

  // Handle login form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value
    });
  };

  // Handle phone input changes
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Check if we're in signup mode
    if (showSignup) {
      setSignupData({
        ...signupData,
        phone: value
      });
    } else {
      setFormData({
        ...formData,
        phone: value
      });
    }
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate phone number
    const cleanedLoginPhone = formData.phone.replace(/\s+/g, '');
    const e164LoginPhone = cleanedLoginPhone.startsWith('+') ? cleanedLoginPhone : `+${cleanedLoginPhone}`;
    const phoneNumber = parsePhoneNumberFromString(e164LoginPhone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      setError("Please enter a valid phone number for the selected country.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: e164LoginPhone,
          password: formData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }
      // Store JWT token (for demo; use httpOnly cookie in production)
      localStorage.setItem("token", data.token);
      router.push(redirect);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate phone number
    const cleanedSignupPhone = signupData.phone.replace(/\s+/g, '');
    const e164SignupPhone = cleanedSignupPhone.startsWith('+') ? cleanedSignupPhone : `+${cleanedSignupPhone}`;
    const phoneNumber = parsePhoneNumberFromString(e164SignupPhone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      setError("Please enter a valid phone number for the selected country.");
      setIsLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.fullName,
          phone: e164SignupPhone,
          password: signupData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }
      alert("Account created successfully! Please log in.");
      setShowSignup(false);
      setError("");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // WhatsApp: send OTP
  const handleWaSend = async (mode) => {
    setWaMode(mode);
    // For signup, require name input
    if (mode === 'signup' && !signupData.fullName.trim()) {
      setError('Please enter your full name before continuing with WhatsApp.');
      return;
    }
    setError("");
    setIsLoading(true);

    const cleaned = waPhone.replace(/\s+/g, '');
    const e164 = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    const phoneNumber = parsePhoneNumberFromString(e164);
    if (!phoneNumber || !phoneNumber.isValid()) {
      setError('Please enter a valid phone number for the selected country.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/auth/send-login-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send WhatsApp code.');
        setIsLoading(false);
        return;
      }
      setWaStep(2);
    } catch (err) {
      setError('Failed to send WhatsApp code.');
    } finally {
      setIsLoading(false);
    }
  };

  // WhatsApp: verify OTP
  const handleWaVerify = async () => {
    setError("");
    setIsLoading(true);
    const cleaned = waPhone.replace(/\s+/g, '');
    const e164 = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    try {
      const res = await fetch(getApiUrl('/api/auth/whatsapp-verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: e164,
          code: waCode,
          mode: waMode,
          name: waMode === 'signup' ? signupData.fullName : undefined
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid code.');
        setIsLoading(false);
        return;
      }
      localStorage.setItem('token', data.token);
      setWaOpen(false);
      setWaStep(1);
      setWaCode('');
      router.push(redirect);
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update forgot password: send code
  const handleSendForgotCode = async () => {
    setForgotError('');
    setIsLoading(true);
    const cleanedForgotPhone = forgotPhone.replace(/\s+/g, '');
    const e164ForgotPhone = cleanedForgotPhone.startsWith('+') ? cleanedForgotPhone : `+${cleanedForgotPhone}`;
    const phoneNumber = parsePhoneNumberFromString(e164ForgotPhone);
    console.log('DEBUG: cleanedForgotPhone:', e164ForgotPhone, 'phoneNumber:', phoneNumber, 'isValid:', phoneNumber && phoneNumber.isValid());
    if (!phoneNumber || !phoneNumber.isValid()) {
      setForgotError('Please enter a valid phone number for the selected country.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(getApiUrl('/api/auth/send-reset-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164ForgotPhone })
      });
      const data = await response.json();
      if (!response.ok) {
        setForgotError(data.error || 'Failed to send WhatsApp message.');
        setIsLoading(false);
        return;
      }
      setForgotStep(2);
    } catch (err) {
      setForgotError('Failed to send WhatsApp message.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update forgot password: verify code
  const handleVerifyForgotCode = async () => {
    setForgotError('');
    setIsLoading(true);
    const cleanedForgotPhone = forgotPhone.replace(/\s+/g, '');
    const e164ForgotPhone = cleanedForgotPhone.startsWith('+') ? cleanedForgotPhone : `+${cleanedForgotPhone}`;
    console.log('Calling verify-reset-code with:', e164ForgotPhone, forgotCode);
    try {
      const response = await fetch(getApiUrl('/api/auth/verify-reset-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164ForgotPhone, code: forgotCode })
      });
      const data = await response.json();
      console.log('verify-reset-code response:', data);
      if (!response.ok) {
        setForgotError(data.error || 'Invalid code.');
        setIsLoading(false);
        return;
      }
      setForgotStep(3);
    } catch (err) {
      setForgotError('Verification failed.');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setForgotError('');
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords don't match.");
      return;
    }
    // Actually reset the password via API
    const cleanedForgotPhone = forgotPhone.replace(/\s+/g, '');
    const e164ForgotPhone = cleanedForgotPhone.startsWith('+') ? cleanedForgotPhone : `+${cleanedForgotPhone}`;
    try {
      const response = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164ForgotPhone, newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        setForgotError(data.error || 'Failed to reset password.');
        return;
      }
      setForgotStep(4);
    } catch (err) {
      setForgotError('Failed to reset password.');
    }
  };

  // Update PhoneInput styling for all usages:
  // Add custom style prop to PhoneInput for consistent look
  const phoneInputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '0.75rem',
    color: 'white',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    marginBottom: '0.25rem',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/img/lambologinphoto.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Navbar - Fixed with higher z-index */}
      <Navbar />

      {/* Main Content Container */}
      <div className="relative z-40 flex items-center justify-center min-h-screen pt-0 pb-6">
        <div className="container-responsive flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            {/* Login/Signup Form Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              {showSignup ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-playfair font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-300 text-sm">Join Noble Car Rental today</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSignup}>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={signupData.fullName}
                        onChange={handleSignupChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                        required
                      />
                      <PhoneInput
                        country={'dz'}
                        value={signupData.phone}
                        onChange={phone => setSignupData({ ...signupData, phone })}
                        inputStyle={phoneInputStyle}
                        buttonStyle={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}
                        dropdownStyle={{ background: 'white', color: 'black' }}
                        containerStyle={{ width: '100%' }}
                        inputProps={{
                          name: 'phone',
                          required: true,
                          autoFocus: false,
                          placeholder: 'Phone',
                        }}
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                        required
                        minLength="6"
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                        <p className="text-red-300 text-sm text-center">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                    </button>

                    {/* Removed WhatsApp signup button */}

                    <p className="text-center text-sm text-gray-300 mt-6">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setShowSignup(false);
                          setError("");
                        }}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300"
                      >
                        Log In
                      </button>
                    </p>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-playfair font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-300 text-sm">Sign in to your account</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <PhoneInput
                        country={'dz'}
                        value={formData.phone}
                        onChange={phone => setFormData({ ...formData, phone })}
                        inputStyle={phoneInputStyle}
                        buttonStyle={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}
                        dropdownStyle={{ background: 'white', color: 'black' }}
                        containerStyle={{ width: '100%' }}
                        inputProps={{
                          name: 'phone',
                          required: true,
                          autoFocus: false,
                          placeholder: 'Phone',
                        }}
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300" onClick={e => { e.preventDefault(); setForgotOpen(true); }}>
                        Forgot password?
                      </a>
                      <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-2"
                        />
                        <span className="text-sm">Remember me</span>
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                        <p className="text-red-300 text-sm text-center">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "SIGNING IN..." : "SIGN IN"}
                    </button>

                    {/* Removed WhatsApp login button and divider */}

                    <p className="text-center text-sm text-gray-300 mt-6">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setShowSignup(true);
                          setError("");
                        }}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300"
                      >
                        Sign Up
                      </button>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={waOpen} onOpenChange={setWaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {waMode === 'login' ? 'Continue with WhatsApp' : 'Sign Up with WhatsApp'}
            </DialogTitle>
            <DialogDescription>
              {waMode === 'login'
                ? 'Enter your phone number to receive a 4-digit code on WhatsApp.'
                : `Sign up as: ${signupData.fullName}`
              }
            </DialogDescription>
          </DialogHeader>
          {waStep === 1 && (
            <div className="space-y-4">
              <PhoneInput
                country={'dz'}
                value={waPhone}
                onChange={setWaPhone}
                inputStyle={phoneInputStyle}
                buttonStyle={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}
                dropdownStyle={{ background: 'white', color: 'black' }}
                containerStyle={{ width: '100%' }}
                inputProps={{ name: 'waPhone', required: true, autoFocus: true, placeholder: 'Phone' }}
              />
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl" onClick={() => handleWaSend(waMode)}>
                  Send Code
                </button>
              </div>
            </div>
          )}
          {waStep === 2 && (
            <div className="space-y-4">
              <label className="block text-sm text-gray-300">Enter the 4-digit code</label>
              <input type="text" value={waCode} onChange={e => setWaCode(e.target.value)} maxLength={4} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300" placeholder="4-digit code" />
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl" onClick={handleWaVerify}>Verify & Continue</button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
          </DialogHeader>
          {forgotStep === 1 && (
            <div className="space-y-4">
              <label className="block text-sm text-gray-300 mb-2">Enter your phone number</label>
              <PhoneInput
                country={'dz'}
                value={forgotPhone}
                onChange={setForgotPhone}
                inputStyle={phoneInputStyle}
                buttonStyle={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}
                dropdownStyle={{ background: 'white', color: 'black' }}
                containerStyle={{ width: '100%' }}
                inputProps={{
                  name: 'forgotPhone',
                  required: true,
                  autoFocus: true,
                  placeholder: 'Phone',
                }}
              />
              {forgotError && <div className="text-red-400 text-sm">{forgotError}</div>}
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-xl" onClick={handleSendForgotCode}>Send Code</button>
            </div>
          )}
          {forgotStep === 2 && (
            <div className="space-y-4">
              <label className="block text-sm text-gray-300 mb-2">Enter the 4-digit code sent to your WhatsApp</label>
              <input type="text" value={forgotCode} onChange={e => setForgotCode(e.target.value)} maxLength={4} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300" placeholder="4-digit code" />
              {forgotError && <div className="text-red-400 text-sm">{forgotError}</div>}
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-xl" onClick={handleVerifyForgotCode}>Verify Code</button>
            </div>
          )}
          {forgotStep === 3 && (
            <div className="space-y-4">
              <label className="block text-sm text-gray-300 mb-2">Set a new password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300" placeholder="New password" />
              <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300" placeholder="Confirm new password" />
              {forgotError && <div className="text-red-400 text-sm">{forgotError}</div>}
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-xl" onClick={handleResetPassword}>Reset Password</button>
            </div>
          )}
          {forgotStep === 4 && (
            <div className="space-y-4 text-center">
              <div className="text-green-400 font-bold text-lg">Password reset successful!</div>
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-xl" onClick={() => { setForgotOpen(false); setForgotStep(1); setForgotPhone(''); setForgotCode(''); setSentCode(''); setNewPassword(''); setConfirmNewPassword(''); setForgotError(''); }}>Back to Login</button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}