import { useState } from 'react';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import LearnDashboard from './LearnDashboard';

function App() {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'learn'

  const handleAuth = (newToken, email, userId) => {
    localStorage.setItem('ctx_token', newToken);
    localStorage.setItem('ctx_email', email);
    localStorage.setItem('ctx_userId', userId);
    setToken(newToken);
    setUserEmail(email);
    setUserId(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem('ctx_token');
    localStorage.removeItem('ctx_email');
    localStorage.removeItem('ctx_userId');
    setToken(null);
    setUserEmail(null);
    setUserId(null);
    setView('dashboard');
  };

  if (!token) {
    return <AuthPage onAuth={handleAuth} />;
  }

  if (view === 'learn') {
    return <LearnDashboard token={token} userId={userId} onBack={() => setView('dashboard')} />;
  }

  return (
    <Dashboard
      token={token}
      userEmail={userEmail}
      userId={userId}
      onLogout={handleLogout}
      onNavigate={setView}
    />
  );
}

export default App;

