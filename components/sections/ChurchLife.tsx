
import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { Translation } from '../../types';

interface ChurchLifeProps {
  t: Translation;
}

const ChurchLife: React.FC<ChurchLifeProps> = ({ t }) => {
  const images = [
    { src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800', alt: 'Small group discussion', className: 'row-span-2' },
    { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800', alt: 'Community service event' },
    { src: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=800', alt: 'Bible study group' },
    { src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1600', alt: 'Worship moment', className: 'col-span-2' },
    { src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800', alt: 'Serving food to the needy' },
  ];

  return (
    <section id="life" className="py-24 md:py-32 bg-secondary">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-medium text-text tracking-tight">
            {t.churchLifeTitle}
          </h2>
          <p className="mt-6 text-lg text-text/70 font-light leading-relaxed">{t.churchLifeSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`overflow-hidden rounded-[2rem] group relative ${img.className || ''}`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ChurchLife;
