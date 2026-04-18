
import React from 'react';
import { Translation } from '../../types';
import Container from './Container';
import Logo from '../Logo';

interface FooterProps {
  t: Translation;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text text-white py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          <div className="md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-10 h-10" light />
              <span className="font-serif font-bold text-2xl tracking-wide">Church Without Walls</span>
            </div>
            <p className="text-white/60 font-light leading-relaxed">{t.footerTagline}</p>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-white/40 mb-6">{t.footerNavigation}</h3>
            <ul className="space-y-4">
              <li><a href="#about" className="text-white/80 hover:text-accent transition-colors text-sm">{t.navAbout}</a></li>
              <li><a href="#sermons" className="text-white/80 hover:text-accent transition-colors text-sm">{t.navSermons}</a></li>
              <li><a href="#groups" className="text-white/80 hover:text-accent transition-colors text-sm">{t.navGroups}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-white/40 mb-6">{t.footerContacts}</h3>
            <ul className="space-y-4 text-white/80 text-sm font-light">
              <li>{t.address}</li>
              <li>{t.phone}</li>
              <li>{t.email}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-white/40 mb-6">{t.footerSocial}</h3>
            <div className="flex gap-6">
              <a href="https://www.facebook.com/bisericafaraziduri" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-accent transition-colors text-sm uppercase tracking-widest">FB</a>
              <a href="https://www.instagram.com/church.without.walls/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-accent transition-colors text-sm uppercase tracking-widest">IG</a>
              <a href="https://www.youtube.com/@Church_Without_Wallsm" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-accent transition-colors text-sm uppercase tracking-widest">YT</a>
            </div>
          </div>
        </div>
        <div className="mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm font-light gap-4">
          <p>© {currentYear} Church Without Walls Chișinău. {t.footerRights}</p>
          <a href="/admin" className="hover:text-accent transition-colors">Admin Login</a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
