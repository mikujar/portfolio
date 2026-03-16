import { useState } from 'react';
import { messagesApi } from '../api';
import type { Message } from '../types';

interface MessageCardProps {
  msg: Message;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onLikeUpdate?: (messageId: string, count: number) => void;
  formatDate: (iso: string) => string;
}

export function MessageCard({ msg, isAdmin, onDelete, onLikeUpdate, formatDate }: MessageCardProps) {
  const [liked, setLiked] = useState(() => !!sessionStorage.getItem(`messageLiked:${msg.id}`));
  const likes = msg.likes ?? 0;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return;
    try {
      const { count } = await messagesApi.like(msg.id);
      sessionStorage.setItem(`messageLiked:${msg.id}`, '1');
      setLiked(true);
      onLikeUpdate?.(msg.id, count);
    } catch {
      // ignore
    }
  };

  return (
    <div className="message-card">
      <div className="message-header">
        <span className="message-nickname">{msg.nickname}</span>
        <span className="message-date">{formatDate(msg.createdAt)}</span>
      </div>
      <p className="message-content">{msg.content}</p>
      <button
        className={`message-like-btn card-like-btn ${liked ? 'liked' : ''}`}
        onClick={handleLike}
        title="点赞"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>{likes}</span>
      </button>
      {isAdmin && (
        <button
          className="message-delete-btn"
          onClick={() => onDelete?.(msg.id)}
          title="删除留言"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
