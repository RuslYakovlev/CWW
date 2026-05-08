import React from 'react';
import { Play } from 'lucide-react';
import { Sermon, Translation } from '../../types';

interface SermonCardProps {
  sermon: Sermon;
  t: Translation;
  onPlay: (sermon: Sermon) => void;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const SermonCard: React.FC<SermonCardProps> = ({ sermon, t, onPlay }) => {
  const canPlay = Boolean(sermon.youtubeId);

  return (
    <article className="group">
      <button
        type="button"
        onClick={() => (canPlay ? onPlay(sermon) : sermon.youtubeUrl && window.open(sermon.youtubeUrl, '_blank', 'noopener,noreferrer'))}
        className="w-full text-left"
        disabled={!canPlay && !sermon.youtubeUrl}
        aria-label={`${t.watchSermon}: ${sermon.title}`}
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <img
            src={sermon.imageUrl}
            alt={sermon.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
          {canPlay && (
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="w-14 h-14 rounded-full bg-white/95 text-text flex items-center justify-center shadow-xl">
                <Play className="w-6 h-6 fill-current ml-1" />
              </span>
            </span>
          )}
        </div>
        <div className="pt-3">
          <h3 className="font-semibold text-text leading-snug line-clamp-2 uppercase">{sermon.title}</h3>
          <p className="mt-2 text-sm text-text/60">{sermon.speaker}</p>
          <p className="text-sm text-text/50">{formatDate(sermon.date)}</p>
        </div>
      </button>
    </article>
  );
};

export default SermonCard;
