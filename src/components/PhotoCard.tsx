import { useState } from 'react';
import { getMediaUrl, photosApi } from '../api';
import type { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onClick: (imageIndex: number) => void;
  isAdmin?: boolean;
  onEdit?: (photo: Photo) => void;
  onDelete?: (id: string) => void;
  onLikeUpdate?: (photoId: string, count: number) => void;
}

export function PhotoCard({ photo, onClick, isAdmin, onEdit, onDelete, onLikeUpdate }: PhotoCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(() => !!sessionStorage.getItem(`photoLiked:${photo.id}`));
  const likes = photo.likes ?? 0;
  const hasMultiple = photo.images.length > 1;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return;
    try {
      const { count } = await photosApi.like(photo.id);
      sessionStorage.setItem(`photoLiked:${photo.id}`, '1');
      setLiked(true);
      onLikeUpdate?.(photo.id, count);
    } catch {
      // ignore
    }
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photo.images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photo.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="photo-card">
      <div className="photo-carousel" onClick={() => onClick(currentIndex)}>
        <div className="carousel-images">
          {photo.images.map((image, index) => (
            <img
              key={index}
              src={getMediaUrl(image)}
              alt={`${photo.title} ${index + 1}`}
              className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        
        {hasMultiple && (
          <>
            <button className="carousel-btn carousel-prev" onClick={goToPrev}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="carousel-btn carousel-next" onClick={goToNext}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="carousel-dots">
              {photo.images.map((_, index) => (
                <span
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        {hasMultiple && (
          <span className="carousel-counter">
            {currentIndex + 1} / {photo.images.length}
          </span>
        )}
      </div>
      <div className="photo-content">
        <span className="photo-date">{photo.date}</span>
        <h3 className="photo-title">{photo.title}</h3>
        <p className="photo-description">{photo.description}</p>
      </div>
      <button
        className={`photo-like-btn card-like-btn ${liked ? 'liked' : ''}`}
        onClick={handleLike}
        title="点赞"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>{likes}</span>
      </button>
      {isAdmin && (
        <div className="admin-actions photo-admin-actions">
          <button className="admin-action-btn edit-btn" onClick={() => onEdit?.(photo)} title="修改">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="admin-action-btn delete-btn" onClick={() => onDelete?.(photo.id)} title="删除">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
