import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TreeSwingIllustration from "../SVG/TreeSwingIllustration.svg";
import logo from "../SVG/logo.svg";
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFirstTimeLogin = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/first-time-login', {
        email: formData.email,
        temp_password: formData.password,
        newPassword: formData.newPassword
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      onLogin();
      navigate('/IncidentList');
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isChangingPassword) {
        await handleFirstTimeLogin();
        return;
      }

      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.requirePasswordChange) {
        setIsChangingPassword(true);
        setError('');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      onLogin();
      navigate('/IncidentList');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
              Welcome to
              <div className="text-emerald-600">IBDIC Customer Support</div>
            </h1>
          </div>
          <div className="w-full h-auto">
            <img src={TreeSwingIllustration} alt="Tree Swing Illustration" className="w-full h-auto" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isChangingPassword ? 'Change Temporary Password' : 'Login'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                disabled={isChangingPassword}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {isChangingPassword ? 'Temporary Password' : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                disabled={isChangingPassword}
              />
            </div>

            {isChangingPassword && (
              <>
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
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {!isChangingPassword && (
              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {loading ? 'Processing...' : isChangingPassword ? 'Change Password' : 'LOGIN'}
            </button>

            {!isChangingPassword && (
              <p className="text-center text-sm">

              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;