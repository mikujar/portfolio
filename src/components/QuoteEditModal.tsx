import { useState } from 'react';
import type { Quote } from '../types';

interface QuoteEditModalProps {
  quote: Quote;
  onSave: (quote: Quote) => void;
  onClose: () => void;
  isNew?: boolean;
}

export function QuoteEditModal({ quote, onSave, onClose, isNew }: QuoteEditModalProps) {
  const [formData, setFormData] = useState<Quote>({ ...quote });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="modal-title">{isNew ? '添加摘抄' : '编辑摘抄'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">内容</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">作者</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author || ''}
              onChange={handleChange}
              placeholder="可选"
            />
          </div>
          <div className="form-group">
            <label htmlFor="source">出处</label>
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source || ''}
              onChange={handleChange}
              placeholder="可选，如《书名》"
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">日期</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
