
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Translation } from '../../types';

interface LatestSermonsProps {
  t: Translation;
}

const LatestSermons: React.FC<LatestSermonsProps> = ({ t }) => {
  const [sermons, setSermons] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Only take the first 3 sermons for the homepage
          setSermons(data.slice(0, 3));
        } else {
          console.error('Expected array of sermons, got:', data);
        }
      })
      .catch(err => console.error('Failed to fetch sermons', err));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Failed to fetch settings', err));
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
          {sermons.map((sermon, index) => {
            const cardContent = (
              <Card key={sermon.id || index} className="p-0 overflow-hidden rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 group bg-white h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img src={sermon.imageUrl} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8">
                  <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">{sermon.speaker}</p>
                  <h3 className="font-serif text-2xl font-semibold text-text">{sermon.title}</h3>
                </div>
              </Card>
            );

            return sermon.youtubeUrl ? (
              <a key={sermon.id || index} href={sermon.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block">
                {cardContent}
              </a>
            ) : (
              <div key={sermon.id || index}>
                {cardContent}
              </div>
            );
          })}
        </motion.div>
        
        <div className="text-center mt-16">
          {settings.youtubeChannelUrl ? (
            <a href={settings.youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="px-10 py-4 text-sm uppercase tracking-widest">{t.allSermons}</Button>
            </a>
          ) : (
            <Button variant="outline" className="px-10 py-4 text-sm uppercase tracking-widest">{t.allSermons}</Button>
          )}
        </div>
      </Container>
    </section>
  );
};

export default LatestSermons;
