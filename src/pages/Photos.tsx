import { useState, useEffect } from 'react';
import { PhotoCard } from '../components/PhotoCard';
import { PhotoEditModal } from '../components/PhotoEditModal';
import { Lightbox } from '../components/Lightbox';
import { photosApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Photo } from '../types';

export function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<{ photo: Photo; imageIndex: number } | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    photosApi.getAll().then(data => {
      setPhotos(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePhotoClick = (photo: Photo, imageIndex: number) => {
    setSelectedPhoto({ photo, imageIndex });
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
  };

  const handleSave = async (updatedPhoto: Photo) => {
    try {
      if (isAdding) {
        const created = await photosApi.create(updatedPhoto);
        setPhotos(prev => [created, ...prev]);
        setIsAdding(false);
      } else {
        const updated = await photosApi.update(updatedPhoto.id, updatedPhoto);
        setPhotos(prev => prev.map(p => p.id === updated.id ? updated : p));
      }
    } catch {
      alert('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这张照片吗？')) {
      try {
        await photosApi.delete(id);
        setPhotos(prev => prev.filter(p => p.id !== id));
      } catch {
        alert('删除失败');
      }
    }
  };

  const handleAdd = () => {
    const newPhoto: Photo = {
      id: '',
      title: '',
      description: '',
      images: ['/photos/'],
      date: new Date().toISOString().split('T')[0],
    };
    setEditingPhoto(newPhoto);
    setIsAdding(true);
  };

  const handleCloseModal = () => {
    setEditingPhoto(null);
    setIsAdding(false);
  };

  const handleLikeUpdate = (photoId: string, count: number) => {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, likes: count } : p));
  };

  return (
    <div className="photos-page">
      <div className="page-header">
        <h1 className="page-title">生活相册</h1>
        <p className="page-subtitle">记录生活中的点滴美好</p>
        {isAdmin && (
          <button className="add-photo-btn" onClick={handleAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            添加照片
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state">加载中...</div>
      ) : (
      <div className="photo-list">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={(imageIndex) => handlePhotoClick(photo, imageIndex)}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLikeUpdate={handleLikeUpdate}
          />
        ))}
      </div>
      )}

      {selectedPhoto && (
        <Lightbox
          images={selectedPhoto.photo.images}
          initialIndex={selectedPhoto.imageIndex}
          title={selectedPhoto.photo.title}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {editingPhoto && (
        <PhotoEditModal
          photo={editingPhoto}
          onSave={handleSave}
          onClose={handleCloseModal}
          isNew={isAdding}
        />
      )}
    </div>
  );
}
