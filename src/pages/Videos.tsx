import { useState, useEffect } from 'react';
import { VideoCard } from '../components/VideoCard';
import { VideoEditModal } from '../components/VideoEditModal';
import { videoCategories } from '../data/videos';
import { videosApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Video } from '../types';

export function Videos() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    videosApi.getAll().then(data => {
      setVideos(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredVideos = selectedCategory === '全部'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
  };

  const handleSave = async (updatedVideo: Video) => {
    try {
      if (isAdding) {
        const created = await videosApi.create(updatedVideo);
        setVideos(prev => [created, ...prev]);
        setIsAdding(false);
      } else {
        const updated = await videosApi.update(updatedVideo.id, updatedVideo);
        setVideos(prev => prev.map(v => v.id === updated.id ? updated : v));
      }
    } catch (error) {
      alert('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个视频吗？')) {
      try {
        await videosApi.delete(id);
        setVideos(prev => prev.filter(v => v.id !== id));
      } catch {
        alert('删除失败');
      }
    }
  };

  const handleAdd = () => {
    const newVideo: Video = {
      id: '',
      title: '',
      description: '',
      thumbnail: '/thumbnails/',
      videoUrl: '/videos/',
      category: '其他',
      date: new Date().toISOString().split('T')[0],
    };
    setEditingVideo(newVideo);
    setIsAdding(true);
  };

  const handleCloseModal = () => {
    setEditingVideo(null);
    setIsAdding(false);
  };

  return (
    <div className="videos-page">
      <div className="page-header">
        <h1 className="page-title">视频作品</h1>
        <p className="page-subtitle">用影像讲述故事，记录美好时光</p>
      </div>

      <div className="category-filter">
        {videoCategories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
        {isAdmin && (
          <button className="add-video-btn" onClick={handleAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            添加视频
          </button>
        )}
      </div>

      <div className="video-grid">
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {loading ? (
        <div className="empty-state">加载中...</div>
      ) : filteredVideos.length === 0 && (
        <div className="empty-state">
          暂无该分类的视频
        </div>
      )}

      {editingVideo && (
        <VideoEditModal
          video={editingVideo}
          onSave={handleSave}
          onClose={handleCloseModal}
          isNew={isAdding}
        />
      )}
    </div>
  );
}
