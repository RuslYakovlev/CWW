
import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import Button from '../ui/Button';
import { Translation } from '../../types';
import { trackEvent } from '../../utils/analytics';

interface BecomeFamilyProps {
  t: Translation;
}

const BecomeFamily: React.FC<BecomeFamilyProps> = ({ t }) => {
  return (
    <section id="family" className="py-24 md:py-32 bg-bg">
      <Container>
        <div className="bg-white rounded-[2.5rem] p-10 md:p-20 shadow-xl shadow-black/5 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-6xl font-medium text-text tracking-tight">
              {t.becomeFamilyTitle}
            </h2>
            <p className="mt-6 text-lg text-text/70 font-light leading-relaxed">
              {t.becomeFamilyText}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onSubmit={(event) => {
              event.preventDefault();
              trackEvent('submit_contact_form');
            }}
            className="w-full space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">{t.yourName}</label>
              <input type="text" id="name" className="block w-full px-6 py-4 bg-secondary/50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all duration-300" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">{t.yourPhone}</label>
              <input type="tel" id="phone" className="block w-full px-6 py-4 bg-secondary/50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all duration-300" />
            </div>
            <Button type="submit" variant="primary" className="w-full !py-5 uppercase tracking-widest text-sm mt-4">
              {t.send}
            </Button>
          </motion.form>
        </div>
      </Container>
    </section>
  );
};

export default BecomeFamily;
