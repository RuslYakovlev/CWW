import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Language, Sermon, Translation } from '../../types';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Container from '../layout/Container';
import SermonCard from '../sermons/SermonCard';
import VideoPlayerModal from '../sermons/VideoPlayerModal';
import { isPublicSermon } from '../../utils/sermons';

type SortMode = 'newest' | 'popular' | 'oldest';

interface SermonsPageProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

const sortOptions: Array<{ value: SortMode; key: keyof Pick<Translation, 'sortNewest' | 'sortPopular' | 'sortOldest'> }> = [
  { value: 'newest', key: 'sortNewest' },
  { value: 'popular', key: 'sortPopular' },
  { value: 'oldest', key: 'sortOldest' },
];

const SermonsPage: React.FC<SermonsPageProps> = ({ lang, setLang, t }) => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => setSermons(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error('Failed to fetch sermons', error);
        setSermons([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleSermons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = sermons.filter(isPublicSermon).filter(sermon => {
      if (!normalizedQuery) return true;
      return `${sermon.title} ${sermon.speaker}`.toLowerCase().includes(normalizedQuery);
    });

    return filtered.sort((a, b) => {
      const left = new Date(a.date).getTime();
      const right = new Date(b.date).getTime();
      if (sortMode === 'oldest') return left - right;
      return right - left;
    });
  }, [query, sermons, sortMode]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header lang={lang} setLang={setLang} t={t} />
      <main className="flex-grow pt-32 pb-20">
        <Container>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">YouTube</p>
                <h1 className="font-serif text-5xl md:text-7xl text-text tracking-tight">{t.sermonsPageTitle}</h1>
              </div>
              <div className="relative w-full lg:w-[420px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/45" />
                <input
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder={t.sermonsSearchPlaceholder}
                  className="w-full pl-12 pr-5 py-4 rounded-full bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortMode(option.value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                    sortMode === option.value ? 'bg-text text-white' : 'bg-white text-text hover:bg-secondary'
                  }`}
                >
                  {t[option.key]}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-text/60">{t.loadingSermons}</p>
            ) : visibleSermons.length === 0 ? (
              <p className="text-text/60">{t.noSermonsFound}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-10">
                {visibleSermons.map(sermon => (
                  <SermonCard key={sermon.id} sermon={sermon} t={t} onPlay={setActiveSermon} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer t={t} lang={lang} />
      <VideoPlayerModal sermon={activeSermon} t={t} onClose={() => setActiveSermon(null)} />
    </div>
  );
};

export default SermonsPage;
