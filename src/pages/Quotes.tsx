import { useState, useEffect } from 'react';
import { QuoteEditModal } from '../components/QuoteEditModal';
import { quotesApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Quote } from '../types';

export function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    quotesApi.getAll().then(data => {
      setQuotes(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
  };

  const handleSave = async (updatedQuote: Quote) => {
    try {
      if (isAdding) {
        const created = await quotesApi.create(updatedQuote);
        setQuotes(prev => [created, ...prev]);
        setIsAdding(false);
      } else {
        const updated = await quotesApi.update(updatedQuote.id, updatedQuote);
        setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q));
      }
    } catch {
      alert('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这条摘抄吗？')) {
      try {
        await quotesApi.delete(id);
        setQuotes(prev => prev.filter(q => q.id !== id));
      } catch {
        alert('删除失败');
      }
    }
  };

  const handleAdd = () => {
    const newQuote: Quote = {
      id: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
    };
    setEditingQuote(newQuote);
    setIsAdding(true);
  };

  const handleCloseModal = () => {
    setEditingQuote(null);
    setIsAdding(false);
  };

  return (
    <div className="quotes-page">
      <div className="page-header">
        <h1 className="page-title">文字摘抄</h1>
        <p className="page-subtitle">那些打动我的句子</p>
        {isAdmin && (
          <button className="add-photo-btn" onClick={handleAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            添加摘抄
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state">加载中...</div>
      ) : (
      <div className="quotes-list">
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-card">
            <div className="quote-mark">"</div>
            <p className="quote-content">{quote.content}</p>
            <div className="quote-footer">
              {quote.author && (
                <span className="quote-author">—— {quote.author}</span>
              )}
              {quote.source && (
                <span className="quote-source">{quote.source}</span>
              )}
            </div>
            <span className="quote-date">{quote.date}</span>
            {isAdmin && (
              <div className="admin-actions quote-admin-actions">
                <button className="admin-action-btn edit-btn" onClick={() => handleEdit(quote)} title="修改">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="admin-action-btn delete-btn" onClick={() => handleDelete(quote.id)} title="删除">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {editingQuote && (
        <QuoteEditModal
          quote={editingQuote}
          onSave={handleSave}
          onClose={handleCloseModal}
          isNew={isAdding}
        />
      )}
    </div>
  );
}
