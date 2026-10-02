import React, { useState } from 'react';
import API from '../api/client';

// 📝 Step 1: Accept the onLoginSuccess prop from App.jsx
const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', isError: false });

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const response = await API.post(endpoint, formData);
      
      if (response.data.success) {
        // Save the access token for authenticated API requests
        localStorage.setItem('accessToken', response.data.token);
        
        setMessage({ 
          text: `${isLogin ? 'Login' : 'Registration'} successful! Redirecting to store...`, 
          isError: false 
        });
        
        // Clear form inputs
        setFormData({ name: '', email: '', password: '' });

        // 🚀 Step 2: Extract the user role dynamically from the backend response payload
        const userRole = response.data.user?.role || 'user';

        // Trigger the screen switch after a brief delay so the user reads the success message
        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess(userRole);
          }, 1000);
        }
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Something went wrong. Please try again.', 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2>{isLogin ? 'Login to Store' : 'Create an Account'}</h2>
      
      {message.text && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: message.isError ? '#721c24' : '#155724', color: message.isError ? '#f8d7da' : '#d4edda' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', boxSizing: 'border-box', backgroundColor: '#2a2a2a', color: '#fff' }} />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', boxSizing: 'border-box', backgroundColor: '#2a2a2a', color: '#fff' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', boxSizing: 'border-box', backgroundColor: '#2a2a2a', color: '#fff' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#646cff', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => { setIsLogin(!isLogin); setMessage({ text: '', isError: false }); }} style={{ color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
    </div>
  );
};

export default Auth;
