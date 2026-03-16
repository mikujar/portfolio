import { useState, useEffect } from 'react';
import { messagesApi } from '../api';
import { MessageCard } from '../components/MessageCard';
import { useAuth } from '../contexts/AuthContext';
import type { Message } from '../types';

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    messagesApi.getAll().then(data => {
      setMessages(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = nickname.trim();
    const c = content.trim();
    if (!n || !c) {
      alert('请填写昵称和留言内容');
      return;
    }
    setSubmitting(true);
    try {
      const created = await messagesApi.create({ nickname: n, content: c });
      setMessages(prev => [created, ...prev]);
      setNickname('');
      setContent('');
    } catch (err) {
      alert(err instanceof Error ? err.message : '留言失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这条留言吗？')) return;
    try {
      await messagesApi.delete(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch {
      alert('删除失败');
    }
  };

  const handleLikeUpdate = (messageId: string, count: number) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, likes: count } : m));
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return d.toLocaleDateString('zh-CN');
  };

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1 className="page-title">留言板</h1>
        <p className="page-subtitle">无需登录，留下你的足迹</p>
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <div className="message-form-row">
          <input
            type="text"
            className="message-input"
            placeholder="昵称（必填）"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={50}
          />
          <button type="submit" className="message-submit-btn" disabled={submitting}>
            {submitting ? '发送中...' : '发送'}
          </button>
        </div>
        <textarea
          className="message-textarea"
          placeholder="写下你想说的话..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          maxLength={2000}
        />
      </form>

      {loading ? (
        <div className="empty-state">加载中...</div>
      ) : messages.length === 0 ? (
        <div className="empty-state">暂无留言，快来写第一条吧～</div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onLikeUpdate={handleLikeUpdate}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
