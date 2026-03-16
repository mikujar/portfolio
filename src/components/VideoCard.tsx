import { useState } from 'react';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  isAdmin?: boolean;
  onEdit?: (video: Video) => void;
  onDelete?: (id: string) => void;
}

export function VideoCard({ video, isAdmin, onEdit, onDelete }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail">
        {isPlaying ? (
          <div className="video-player">
            <video
              src={video.videoUrl}
              controls
              autoPlay
              onEnded={handleStop}
            />
            <button className="close-video" onClick={handleStop}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <img src={video.thumbnail} alt={video.title} />
            <button className="play-icon" onClick={handlePlay}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.6)" />
                <path d="M19 15L35 24L19 33V15Z" fill="white" />
              </svg>
            </button>
          </>
        )}
      </div>
      <div className="video-info">
        <span className="video-category">{video.category}</span>
        <h3 className="video-title">{video.title}</h3>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
        <span className="video-date">{video.date}</span>
      </div>
      {isAdmin && (
        <div className="admin-actions">
          <button className="admin-action-btn edit-btn" onClick={() => onEdit?.(video)} title="修改">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="admin-action-btn delete-btn" onClick={() => onDelete?.(video.id)} title="删除">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
