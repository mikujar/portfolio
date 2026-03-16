import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { visitsApi } from './api';
import { Home } from './pages/Home';
import { Videos } from './pages/Videos';
import { Photos } from './pages/Photos';
import { Quotes } from './pages/Quotes';
import { Tasks } from './pages/Tasks';
import { Expenses } from './pages/Expenses';
import { Messages } from './pages/Messages';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import type { Page } from './types';
import './App.css';

function getPageFromHash(): Page {
  const hash = window.location.hash.slice(1);
  if (hash === 'videos' || hash === 'photos' || hash === 'quotes' || hash === 'tasks' || hash === 'expenses' || hash === 'messages') {
    return hash;
  }
  return 'home';
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);
  const [showLogin, setShowLogin] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    if (sessionStorage.getItem('visitCounted')) {
      visitsApi.get().then(({ count }) => setVisitCount(count)).catch(() => {});
    } else {
      sessionStorage.setItem('visitCounted', '1');
      visitsApi.increment().then(({ count }) => setVisitCount(count)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: Page) => {
    window.location.hash = page === 'home' ? '' : page;
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'videos':
        return <Videos />;
      case 'photos':
        return <Photos />;
      case 'quotes':
        return <Quotes />;
      case 'tasks':
        return <Tasks />;
      case 'expenses':
        return <Expenses />;
      case 'messages':
        return <Messages />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main">
        {renderPage()}
      </main>
      <footer className="footer">
        <p>
          © 2026 陈禾佳 · 用心记录生活
          <span className="footer-visits"> · 访问量 {visitCount != null ? visitCount : '—'}</span>
        </p>
        {isAdmin ? (
          <button className="footer-admin-btn" onClick={logout} title="退出管理">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <button className="footer-admin-btn" onClick={() => setShowLogin(true)} title="管理员登录">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </footer>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;
