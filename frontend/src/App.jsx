import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import AttendanceDashboard from './components/AttendanceDashboard';
import './App.css';

const MainDashboardLayout = () => {
  const { logout } = useAuth();
  
  return (
    <div>
      {/* Basic Utility Global Top Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 40px', backgroundColor: '#343a40', color: 'white' }}>
        <h3 style={{ margin: 0 }}>🏫 Student Management Platform</h3>
        <button 
          onClick={logout} 
          style={{ padding: '6px 14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Disconnect Session
        </button>
      </header>

      {/* Main Core Work Area */}
      <main style={{ padding: '20px' }}>
        <AttendanceDashboard />
      </main>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <MainDashboardLayout />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;