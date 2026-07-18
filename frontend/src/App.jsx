import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';

const DashboardTest = () => {
  const { logout } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Welcome to the Teacher Dashboard!</h1>
      <p>Your JWT token is securely stored and will auto-inject into all future API requests.</p>
      <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
        Log Out
      </button>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <DashboardTest />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;