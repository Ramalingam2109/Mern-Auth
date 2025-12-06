import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import axios from 'axios';

// Enhanced password validation schema
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(50, 'Password must be less than 50 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const VerifyOtp = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const email = location.state?.email;
  const purpose = location.state?.purpose || 'reset-password';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  // Handle countdown for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      toast.error('Email address is required');
      navigate('/reset-password');
    }
  }, [email, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const endpoint = purpose === 'reset-password' 
        ? 'reset-password' 
        : 'verify-email';

      const { data: response } = await axios.post(
        `${backendUrl}api/auth/${endpoint}`,
        {
          email,
          otp: data.otp,
          ...(purpose === 'reset-password' && { 
            newPassword: data.newPassword 
          }),
        },
        { withCredentials: true }
      );

      if (response.success) {
        toast.success(
          purpose === 'reset-password' 
            ? 'Password reset successfully!' 
            : 'Email verified successfully!'
        );
        navigate(purpose === 'reset-password' ? '/login' : '/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Verification failed';
      
      if (error.response?.data?.field) {
        setError(error.response.data.field, {
          type: 'manual',
          message: errorMessage,
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);
      setCanResend(false);
      setCountdown(30);

      const endpoint = purpose === 'reset-password' 
        ? 'send-reset-otp' 
        : 'send-verify-otp';

      const { data } = await axios.post(
        `${backendUrl}api/auth/${endpoint}`,
        { email },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('New OTP sent successfully!');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        'Failed to resend OTP. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 mx-4 bg-white shadow-lg rounded-xl">
        <div className="flex justify-center mb-6">
          <img 
            src={assets.logo} 
            alt="Logo" 
            className="w-32 cursor-pointer" 
            onClick={() => navigate('/')}
          />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {purpose === 'reset-password' ? 'Reset Password' : 'Verify Email'}
          </h1>
          <p className="mt-2 text-gray-600">
            Enter the OTP sent to <span className="font-medium">{email}</span>
            {purpose === 'reset-password' && ' and your new password'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block mb-1 text-sm font-medium text-gray-700">
              6-digit OTP
            </label>
            <div className="relative">
              <input
                id="otp"
                {...register('otp')}
                className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.otp ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456"
                maxLength={6}
                inputMode="numeric"
                disabled={isSubmitting}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          {purpose === 'reset-password' && (
            <>
              <div>
                <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    {...register('newPassword')}
                    type="password"
                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="New password"
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    type="password"
                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {purpose === 'reset-password' ? 'Resetting...' : 'Verifying...'}
              </span>
            ) : (
              purpose === 'reset-password' ? 'Reset Password' : 'Verify Email'
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <button
            onClick={handleResendOtp}
            disabled={!canResend || isSubmitting}
            className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none ${
              !canResend ? 'text-gray-400 cursor-not-allowed' : ''
            }`}
          >
            {canResend ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;