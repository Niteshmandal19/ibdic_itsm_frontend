
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';

// Predefined roles from backend model
const ROLES = [
  'IBDIC admin',
  'IBDIC user',
  'org_admin',
  'org_user'
];

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ROLES,  // Default to first role
    organization_id: ''   // Optional organization
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', formData);

      // Show success message
      alert('Registration successful! Please login.');

      // Redirect to login page
      navigate('/login');
    } catch (err) {
      // Handle specific error types
      if (err.response) {
        const errorMessage = err.response.data.message ||
          (err.response.data.errors && err.response.data.errors[0]) ||
          'Registration failed';
        setError(errorMessage);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
     
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="organization_id"
              placeholder="Organization_id"
              className="form-input"
              value={formData.organization_id}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="switch-auth">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;