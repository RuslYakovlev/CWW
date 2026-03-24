
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import Button from '../ui/Button';
import { Translation } from '../../types';

interface UpcomingEventProps {
  t: Translation;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ t }) => {
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEvent(data[0]);
        } else {
          console.error('Expected array of events, got:', data);
        }
      })
      .catch(err => console.error('Failed to fetch events', err));
  }, []);

  if (!event) return null;

  return (
    <section id="events" className="py-24 md:py-32 bg-secondary">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="font-serif text-4xl md:text-6xl font-medium tracking-tight mb-4 text-text">{event.title || t.upcomingEventTitle}</h2>
            <p className="text-xl text-primary font-semibold mb-8 uppercase tracking-widest text-sm">{event.subtitle || t.sundayService}</p>
            <div className="space-y-4 text-lg text-text/80 font-light">
              <p><strong className="font-semibold">{t.dateLabel}:</strong> {event.dateLabel || t.everySunday}</p>
              <p><strong className="font-semibold">{t.timeLabel}:</strong> {event.timeLabel || t.serviceTimes}</p>
              <p><strong className="font-semibold">{t.formatLabel}:</strong> {event.formatLabel || t.offlineOnline}</p>
            </div>
            <Button variant="secondary" className="mt-10">{t.addToCalendar}</Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 rounded-[2rem] overflow-hidden shadow-xl shadow-black/5 aspect-[4/3]"
          >
            <img src={event.imageUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200"} alt="Church service" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default UpcomingEvent;