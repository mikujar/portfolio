import { useState, useEffect } from 'react';
import { QuoteEditModal } from '../components/QuoteEditModal';
import { QuoteCard } from '../components/QuoteCard';
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

  const handleLikeUpdate = (quoteId: string, count: number) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, likes: count } : q));
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
          <QuoteCard
            key={quote.id}
            quote={quote}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLikeUpdate={handleLikeUpdate}
          />
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
