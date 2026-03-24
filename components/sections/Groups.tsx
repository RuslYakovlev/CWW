import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, MapPin } from 'lucide-react';
import Container from '../layout/Container';
import { Translation } from '../../types';

interface GroupsProps {
  t: Translation;
}

const Groups: React.FC<GroupsProps> = ({ t }) => {
  return (
    <section id="groups" className="py-24 md:py-32 bg-white">
      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[2rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10 z-10" />
              <img
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1000"
                alt="Small group discussion"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-text tracking-tight mb-6">
              {t.groupsTitle}
            </h2>
            <p className="text-lg text-text/70 font-light leading-relaxed mb-10">
              {t.groupsSubtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-text/60 mb-1">{t.timeLabel}</p>
                  <p className="text-lg font-medium text-text">{t.groupsTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-text/60 mb-1">{t.formatLabel}</p>
                  <p className="text-lg font-medium text-text">{t.groupsLocation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Groups;
