'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    otp: ['', '', '', '', '', ''],
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  
  // Refs for OTP input boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check if user is in guest mode
        const guestMode = document.cookie.includes('guest_mode=true');
        const guestUsername = document.cookie.split('guest_username=')[1]?.split(';')[0];
        
        if (guestMode && guestUsername) {
          // User is in guest mode, redirect to dashboard
          window.location.href = '/dashboard';
          return;
        }
        
        // If not guest mode, check regular authentication
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // User is already logged in, redirect to dashboard
            window.location.href = '/dashboard';
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, []); // Remove dependencies to prevent infinite loop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle OTP input changes
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOTP = [...formData.otp];
    newOTP[index] = value;
    setFormData({ ...formData, otp: newOTP });
    
    // Auto-focus to next input box
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Clear OTP error when user types
    if (errors.otp) {
      setErrors({ ...errors, otp: '' });
    }
  };

  // Handle OTP backspace
  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOTP = pastedData.split('');
      setFormData({ ...formData, otp: newOTP });
      // Focus last input
      otpRefs.current[5]?.focus();
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const otpString = formData.otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setErrors({ terms: 'You must accept the Terms of Service and Privacy Policy' });
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStep1()) {
      setIsLoading(true);
      try {
        startLoading(); // Start global loading
        // Create account and send OTP
        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('username', formData.username);
        formDataToSend.append('password', formData.password);

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          body: formDataToSend,
        });

        const result = await response.json();

        if (result.success) {
          setSuccessMessage('Account created successfully! Please check your email for the verification code.');
          setCurrentStep(2);
        } else {
          setErrors({ general: result.error });
        }
      } catch (error) {
        setErrors({ general: 'Failed to create account. Please try again.' });
      } finally {
        setIsLoading(false);
        stopLoading(); // Stop global loading
      }
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      startLoading(); // Start global loading
      // Verify OTP
      const otpString = formData.otp.join('');
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpString,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Automatically sign in the user after successful OTP verification
        try {
          const signInFormData = new FormData();
          signInFormData.append('email', formData.email);
          signInFormData.append('password', formData.password);

          const signInResponse = await fetch('/api/auth/signin', {
            method: 'POST',
            body: signInFormData,
          });

          const signInResult = await signInResponse.json();

          if (signInResult.success) {
            setSuccessMessage('Account setup completed successfully! Redirecting to dashboard...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 2000);
          } else {
            setErrors({ general: 'Account created but failed to sign in automatically. Please sign in manually.' });
          }
        } catch (signInError) {
          setErrors({ general: 'Account created but failed to sign in automatically. Please sign in manually.' });
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Failed to complete account setup. Please try again.' });
    } finally {
      setIsLoading(false);
      stopLoading(); // Stop global loading
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      startLoading(); // Start global loading
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('OTP resent successfully! Please check your email.');
        // Clear OTP inputs
        setFormData({ ...formData, otp: ['', '', '', '', '', ''] });
        // Focus first OTP input
        otpRefs.current[0]?.focus();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Failed to resend OTP. Please try again.' });
    } finally {
      setIsLoading(false);
      stopLoading(); // Stop global loading
    }
  };

  const handleGuestSignUp = () => {
    // Generate temporary guest credentials
    const guestEmail = `guest_${Date.now()}@voiptrace.guest`;
    const guestPassword = `guest_${Math.random().toString(36).substring(2, 15)}`;
    
    // Store guest credentials in cookies (not in database)
    document.cookie = `guest_email=${guestEmail}; path=/; max-age=86400`; // 24 hours
    document.cookie = `guest_password=${guestPassword}; path=/; max-age=86400`; // 24 hours
    document.cookie = `guest_username=User; path=/; max-age=86400`; // 24 hours
    document.cookie = `guest_mode=true; path=/; max-age=86400`; // 24 hours
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username *
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500 ${
            errors.username ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Choose a username"
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create a password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      <button
        type="button"
        onClick={handleNext}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </div>
        ) : (
          'Continue'
        )}
      </button>

      {/* Guest Sign Up Button */}
      <button
        type="button"
        onClick={handleGuestSignUp}
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors border border-gray-300"
      >
        Try out as guest
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
        <p className="text-gray-700">
          We've sent a 6-digit verification code to <span className="font-semibold">{formData.email}</span>
        </p>
        {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
          Enter the 6-digit verification code
        </label>
        <div className="flex justify-center space-x-3">
          {formData.otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                otpRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleOTPKeyDown(index, e)}
              onPaste={handleOTPPaste}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="0"
            />
          ))}
        </div>
        {errors.otp && <p className="text-red-500 text-sm mt-2 text-center">{errors.otp}</p>}
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={handlePrevious}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Verify
        </button>
      </div>

      <div className="text-center">
        <p className="text-gray-700 text-sm">
          Didn't receive the code?{' '}
          <button 
            onClick={resendOTP}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-500 font-semibold disabled:opacity-50"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Almost there!</h3>
        <p className="text-gray-700">Please review and accept our terms to complete your account setup</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Acceptable Use Policy
            </a>
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <input
            id="acceptPrivacy"
            name="acceptPrivacy"
            type="checkbox"
            checked={formData.acceptPrivacy}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
          />
          <label htmlFor="acceptPrivacy" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Privacy Policy
            </a>
            {' '}and consent to the processing of my data
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <input
            id="acceptMarketing"
            name="acceptMarketing"
            type="checkbox"
            checked={formData.acceptMarketing}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
          />
          <label htmlFor="acceptMarketing" className="text-sm text-gray-700">
            I would like to receive updates about new features and security alerts (optional)
          </label>
        </div>
      </div>

      {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={handlePrevious}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-700">Join VoIP Trace and secure your communications</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-700">
            Already have an account?{' '}
            <Link href="/authpage/sign_in" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/home" className="text-gray-600 hover:text-gray-800 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;