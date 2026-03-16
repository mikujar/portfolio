import { useState, useRef } from 'react';
import type { Photo } from '../types';
import { uploadPhotos } from '../api';

interface PhotoEditModalProps {
  photo: Photo;
  onSave: (photo: Photo) => void;
  onClose: () => void;
  isNew?: boolean;
}

export function PhotoEditModal({ photo, onSave, onClose, isNew }: PhotoEditModalProps) {
  const [formData, setFormData] = useState<Photo>({ ...photo });
  const [imagesText, setImagesText] = useState(photo.images.join('\n'));
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImagesText(e.target.value);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setImagesText(files.map(f => f.name).join('\n'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let images: string[];
    
    if (selectedFiles.length > 0) {
      setUploading(true);
      try {
        const result = await uploadPhotos(selectedFiles);
        images = result.images;
      } catch {
        alert('上传失败');
        setUploading(false);
        return;
      }
      setUploading(false);
    } else {
      images = imagesText.split('\n').map(s => s.trim()).filter(s => s);
    }
    
    onSave({ ...formData, images });
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
        <h2 className="modal-title">{isNew ? '添加照片' : '编辑照片'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">标题</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
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
          <div className="form-group">
            <label>图片</label>
            <div className="file-upload-area">
              <textarea
                value={imagesText}
                onChange={handleImagesChange}
                rows={4}
                placeholder="图片路径（每行一个）或点击下方上传"
                readOnly={selectedFiles.length > 0}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="btn btn-secondary upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                选择图片上传
              </button>
              {selectedFiles.length > 0 && (
                <p className="upload-hint">已选择 {selectedFiles.length} 个文件</p>
              )}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? '上传中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
