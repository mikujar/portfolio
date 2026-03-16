import { useState } from 'react';
import { quotesApi } from '../api';
import type { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  isAdmin?: boolean;
  onEdit?: (quote: Quote) => void;
  onDelete?: (id: string) => void;
  onLikeUpdate?: (quoteId: string, count: number) => void;
}

export function QuoteCard({ quote, isAdmin, onEdit, onDelete, onLikeUpdate }: QuoteCardProps) {
  const [liked, setLiked] = useState(() => !!sessionStorage.getItem(`quoteLiked:${quote.id}`));
  const likes = quote.likes ?? 0;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return;
    try {
      const { count } = await quotesApi.like(quote.id);
      sessionStorage.setItem(`quoteLiked:${quote.id}`, '1');
      setLiked(true);
      onLikeUpdate?.(quote.id, count);
    } catch {
      // ignore
    }
  };

  return (
    <div className="quote-card">
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
      <button
        className={`quote-like-btn card-like-btn ${liked ? 'liked' : ''}`}
        onClick={handleLike}
        title="点赞"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>{likes}</span>
      </button>
      {isAdmin && (
        <div className="admin-actions quote-admin-actions">
          <button className="admin-action-btn edit-btn" onClick={() => onEdit?.(quote)} title="修改">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="admin-action-btn delete-btn" onClick={() => onDelete?.(quote.id)} title="删除">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
