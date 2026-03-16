import { useState, useRef } from 'react';
import type { Video } from '../types';
import { videoCategories } from '../data/videos';
import { uploadVideoFiles } from '../api';

interface VideoEditModalProps {
  video: Video;
  onSave: (video: Video) => void;
  onClose: () => void;
  isNew?: boolean;
}

export function VideoEditModal({ video, onSave, onClose, isNew }: VideoEditModalProps) {
  const [formData, setFormData] = useState<Video>({ ...video });
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalData = { ...formData };
    
    if (videoFile || thumbnailFile) {
      setUploading(true);
      try {
        const uploadResult = await uploadVideoFiles(videoFile || undefined, thumbnailFile || undefined);
        if (uploadResult.videoUrl) {
          finalData.videoUrl = uploadResult.videoUrl;
        }
        if (uploadResult.thumbnail) {
          finalData.thumbnail = uploadResult.thumbnail;
        }
      } catch {
        alert('上传失败');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    onSave(finalData);
    onClose();
  };

  const categories = videoCategories.filter(c => c !== '全部');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="modal-title">{isNew ? '添加视频' : '编辑视频'}</h2>
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
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">分类</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
          </div>
          
          <div className="form-group">
            <label>视频文件</label>
            <div className="file-upload-row">
              <input
                type="text"
                name="videoUrl"
                value={videoFile ? videoFile.name : formData.videoUrl}
                onChange={handleChange}
                placeholder="视频路径或上传文件"
                readOnly={!!videoFile}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => videoInputRef.current?.click()}
              >
                选择
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>缩略图</label>
            <div className="file-upload-row">
              <input
                type="text"
                name="thumbnail"
                value={thumbnailFile ? thumbnailFile.name : formData.thumbnail}
                onChange={handleChange}
                placeholder="缩略图路径或上传文件"
                readOnly={!!thumbnailFile}
              />
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                选择
              </button>
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
