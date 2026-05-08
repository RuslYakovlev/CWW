import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Card from '../ui/Card';
import { Sermon, Translation } from '../../types';
import VideoPlayerModal from '../sermons/VideoPlayerModal';
import { isPublicSermon } from '../../utils/sermons';

interface LatestSermonsProps {
  t: Translation;
}

const LatestSermons: React.FC<LatestSermonsProps> = ({ t }) => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSermons(data.filter(isPublicSermon).slice(0, 3));
      })
      .catch(err => console.error('Failed to fetch sermons', err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <section id="sermons" className="py-24 md:py-32 bg-bg">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-medium text-text tracking-tight">
            {t.latestSermonsTitle}
          </h2>
        </motion.div>

        <motion.div
          key={sermons.length}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {sermons.map((sermon, index) => (
            <button
              key={sermon.id || index}
              type="button"
              onClick={() => sermon.youtubeId ? setActiveSermon(sermon) : sermon.youtubeUrl && window.open(sermon.youtubeUrl, '_blank', 'noopener,noreferrer')}
              className="text-left"
              aria-label={`${t.watchSermon}: ${sermon.title}`}
            >
              <Card className="p-0 overflow-hidden rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 group bg-white h-full">
                <div className="aspect-video overflow-hidden relative bg-black">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img src={sermon.imageUrl} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8">
                  <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">{sermon.speaker}</p>
                  <h3 className="font-serif text-2xl font-semibold text-text">{sermon.title}</h3>
                </div>
              </Card>
            </button>
          ))}
        </motion.div>

        <div className="text-center mt-16">
          <Link
            to="/sermons"
            className="inline-flex px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300 border border-text/20 text-text hover:bg-text hover:text-white focus:outline-none focus:ring-4 focus:ring-text/20"
          >
            {t.allSermons}
          </Link>
        </div>
      </Container>
      <VideoPlayerModal sermon={activeSermon} t={t} onClose={() => setActiveSermon(null)} />
    </section>
  );
};

export default LatestSermons;
