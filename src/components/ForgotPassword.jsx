import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TreeSwingIllustration from "../SVG/TreeSwingIllustration.svg";
import logo from "../SVG/logo.svg";

const ForgotPassword = () => {
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const [formData, setFormData] = useState({
    email: '',
    resetToken: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/request-password-reset', {
        email: formData.email
      });

      setSuccess('If your email is registered, you will receive password reset instructions shortly.');
      setTimeout(() => {
        setStep('reset');
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        email: formData.email,
        resetToken: formData.resetToken,
        newPassword: formData.newPassword
      });

      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden bg-blue-100">
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-300 rounded-full opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="hidden md:flex flex-col items-start space-y-6">
          <div className="w-auto h-auto">
            <img src={logo} alt="logo" className="w-full h-auto" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              Reset Your Password
              <div className="text-emerald-600">IBDIC Customer Support</div>
            </h1>
          </div>
          <div className="w-full h-auto">
            <img src={TreeSwingIllustration} alt="Tree Swing Illustration" className="w-full h-auto" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {step === 'request' ? 'Forgot Password' : 'Reset Password'}
          </h2>

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {loading ? 'Processing...' : 'Request Password Reset'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full mt-4 text-emerald-600 hover:text-emerald-700"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Reset Token</label>
                <input
                  type="text"
                  name="resetToken"
                  value={formData.resetToken}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  placeholder="Enter the token from your email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {loading ? 'Processing...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => setStep('request')}
                className="w-full mt-4 text-emerald-600 hover:text-emerald-700"
              >
                Back to Reset Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;