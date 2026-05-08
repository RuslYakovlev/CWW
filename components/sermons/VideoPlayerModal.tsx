import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Sermon, Translation } from '../../types';

interface VideoPlayerModalProps {
  sermon: Sermon | null;
  t: Translation;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ sermon, t, onClose }) => {
  useEffect(() => {
    if (!sermon) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sermon, onClose]);

  if (!sermon?.youtubeId) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={sermon.title}
    >
      <div className="w-full max-w-5xl" onClick={event => event.stopPropagation()}>
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white text-text flex items-center justify-center shadow-lg hover:bg-secondary transition-colors"
            aria-label={t.closePlayer}
            title={t.closePlayer}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${sermon.youtubeId}?autoplay=1&rel=0`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <div className="bg-white rounded-b-lg px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-accent font-bold">{sermon.speaker}</p>
          <h2 className="mt-1 font-serif text-2xl md:text-3xl text-text">{sermon.title}</h2>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
