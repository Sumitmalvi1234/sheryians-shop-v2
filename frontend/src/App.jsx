import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 🔑 Default role tracking state

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole'); // Load saved role on refresh
    if (token) {
      setIsLoggedIn(true);
      if (role) setUserRole(role);
    }
  }, []);

  // Handle setting authentication states upon successful login/signup
  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role || 'user');
    if (role) localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('user');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#242424', padding: '20px', boxSizing: 'border-box' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1300px', margin: '0 auto 30px auto' }}>
        <div>
          <h1 style={{ color: '#646cff', fontFamily: 'sans-serif', margin: 0 }}>
            Sheryians E-Commerce Portal
          </h1>
          {isLoggedIn && (
            <span style={{ fontSize: '12px', color: '#aaa', backgroundColor: '#333', padding: '3px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '5px' }}>
              👤 Role: <strong style={{ color: userRole === 'admin' ? '#ff9900' : '#44ff44' }}>{userRole.toUpperCase()}</strong> View
            </span>
          )}
        </div>
        {isLoggedIn && (
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Logout 🚪
          </button>
        )}
      </div>
      
      {/* SECURITY ACCESS VIEWS ROUTER */}
      {!isLoggedIn ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard role={userRole} />
      )}

    </div>
  );
}

export default App;
