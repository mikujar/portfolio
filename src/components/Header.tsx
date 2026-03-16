import { useState } from 'react';
import type { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={() => handleNavigate('home')}>
          陈禾佳
        </h1>
        <button 
          className={`menu-toggle ${menuOpen ? 'open' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <button
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigate('home')}
          >
            首页
          </button>
          <button
            className={`nav-item ${currentPage === 'videos' ? 'active' : ''}`}
            onClick={() => handleNavigate('videos')}
          >
            视频作品
          </button>
          <button
            className={`nav-item ${currentPage === 'photos' ? 'active' : ''}`}
            onClick={() => handleNavigate('photos')}
          >
            生活相册
          </button>
          <button
            className={`nav-item ${currentPage === 'quotes' ? 'active' : ''}`}
            onClick={() => handleNavigate('quotes')}
          >
            文字摘抄
          </button>
          <button
            className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`}
            onClick={() => handleNavigate('tasks')}
          >
            任务排序
          </button>
          <button
            className={`nav-item ${currentPage === 'expenses' ? 'active' : ''}`}
            onClick={() => handleNavigate('expenses')}
          >
            记账本
          </button>
        </nav>
      </div>
    </header>
  );
}
