import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { Translation } from '../../types';

interface LocalSeoProps {
  t: Translation;
}

const LocalSeo: React.FC<LocalSeoProps> = ({ t }) => (
  <section className="py-20 bg-secondary/60" aria-labelledby="local-seo-title">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 id="local-seo-title" className="font-serif text-4xl md:text-5xl font-medium text-text tracking-tight">
          {t.localSeoTitle}
        </h2>
        <p className="mt-6 text-lg text-text/70 font-light leading-relaxed">
          {t.localSeoText}
        </p>
      </motion.div>
    </Container>
  </section>
);

export default LocalSeo;
