import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

// Define Zod schema for OTP validation
const otpSchema = z.object({
  otp: z.string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" })
});

const EmailVerify = () => {
  const { backendUrl, userData, isLoggedIn, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const otpValue = watch('otp');

  // Check authentication and verification status
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const checkVerification = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}api/user/verify-status`);
        if (data.isVerified) {
          navigate('/');
        }
      } catch (error) {
        console.error("Verification check failed:", error);
      }
    };

    checkVerification();
  }, [isLoggedIn, navigate, backendUrl]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
  }, [resendDisabled, countdown]);

  // Handle OTP input with validation
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = otpValue.split('');
    newOtp[index] = value;
    const joinedOtp = newOtp.join('');

    setValue('otp', joinedOtp, { shouldValidate: true });

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const verifyEmail = async (data) => {
    try {
      setIsLoading(true);
      const { data: response } = await axios.post(
        `${backendUrl}api/auth/verify-email`,
        { otp: data.otp, email: userData.email }
      );

      if (response.success) {
        await getUserData();
        toast.success('Email verified successfully!');
        navigate('/');
      } else {
        setError('otp', { message: response.message || 'Invalid OTP' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendDisabled(true);
      const { data } = await axios.post(
        `${backendUrl}api/auth/resend-verification-email`,
        { email: userData.email }
      );
      
      if (data.success) {
        toast.success('New OTP sent to your email!');
      } else {
        toast.error(data.message || 'Failed to resend OTP');
        setResendDisabled(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
      setResendDisabled(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">
            We've sent a 6-digit code to <span className="font-medium">{userData?.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(verifyEmail)} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={otpValue[index] || ''}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus={index === 0}
                disabled={isLoading}
              />
            ))}
          </div>

          <input type="hidden" {...register('otp')} />

          {errors.otp && (
            <p className="text-sm text-center text-red-600">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || otpValue.length !== 6}
            className={`w-full py-3 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              (isLoading || otpValue.length !== 6) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={resendOtp}
            disabled={resendDisabled}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;