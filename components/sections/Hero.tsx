import React from 'react';
import { Translation } from '../../types';
import Button from '../ui/Button';
import Container from '../layout/Container';
import { trackEvent } from '../../utils/analytics';

interface HeroProps {
  t: Translation;
}

const Hero: React.FC<HeroProps> = ({ t }) => {
  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        role="img"
        aria-label={t.heroImageAlt}
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop")',
        }}
      />
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <Container className="relative z-10 flex flex-col items-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-white/90 font-sans font-light leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button as="a" href="#family" onClick={() => trackEvent('click_visit_church')} variant="primary" className="bg-accent text-white hover:bg-accent/90 border-none px-10 py-4 text-sm uppercase tracking-widest">
              {t.ctaJoin}
            </Button>
            <Button as="a" href="#sermons" onClick={() => trackEvent('click_watch_online')} variant="outline" className="border-white/40 text-white hover:bg-white hover:text-text px-10 py-4 text-sm uppercase tracking-widest">
              {t.ctaWatchOnline}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
