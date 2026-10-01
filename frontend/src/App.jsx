import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  // Track the authentication status of the user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if a user token already exists in storage when the app first loads
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Simple function to clear session and log out
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#242424', padding: '20px', boxSizing: 'border-box' }}>
      
      {/* HEADER SECTION WITH USER STATUS ACTION BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 30px auto' }}>
        <h1 style={{ color: '#646cff', fontFamily: 'sans-serif', margin: 0 }}>
          Sheryians E-Commerce Portal
        </h1>
        {isLoggedIn && (
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            🚪 Log Out
          </button>
        )}
      </div>
      
      {/* 🔐 SWITCH VIEW LOGIC BASED ON LOGIN STATE */}
      {!isLoggedIn ? (
        // If NOT logged in: Show the Login/Signup panel card
        <Auth onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        // If IS logged in: Hide the login card and show the real Product Dashboard catalog
        <Dashboard />
      )}

    </div>
  );
}

export default App;
