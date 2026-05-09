import React from 'react';
import { Link } from 'react-router-dom';
import { Language, Translation } from '../../types';
import Container from './Container';
import Logo from '../Logo';
import { trackEvent } from '../../utils/analytics';

interface FooterProps {
  t: Translation;
  lang?: Language;
}

const Footer: React.FC<FooterProps> = ({ t, lang = 'ru' }) => {
  const currentYear = new Date().getFullYear();
  const churchName = lang === 'ro' ? 'Biserica Fără Ziduri' : lang === 'en' ? 'Church Without Walls' : 'Церковь Без Стен';
  const phoneHref = `tel:${t.phone.replace(/\s/g, '')}`;
  const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=Strada%20Carierei%20MD-2024%20Chisinau%20Moldova';

  return (
    <footer className="bg-text text-white py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          <div className="md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-12 h-12" light lang={lang} />
              <span className="font-serif font-bold text-2xl tracking-wide">{churchName}</span>
            </div>
            <p className="text-white/60 font-light leading-relaxed">{t.footerTagline}</p>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-white/40 mb-6">{t.footerNavigation}</h3>
            <ul className="space-y-4">
              <li><a href="/#about" className="text-white/80 hover:text-accent transition-colors text-sm">{t.navAbout}</a></li>
              <li><Link to="/sermons" className="text-white/80 hover:text-accent transition-colors text-sm">{t.navSermons}</Link></li>
              <li><a href="/#groups" className="text-white/80 hover:text-accent transition-colors text-sm">{t.navGroups}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-white/40 mb-6">{t.footerContacts}</h3>
            <ul className="space-y-4 text-white/80 text-sm font-light">
              <li>{t.address}</li>
              <li>
                <a href={phoneHref} onClick={() => trackEvent('click_phone')} className="hover:text-accent transition-colors">
                  {t.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${t.email}`} onClick={() => trackEvent('click_email')} className="hover:text-accent transition-colors">
                  {t.email}
                </a>
              </li>
              <li>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_directions')} className="hover:text-accent transition-colors">
                  {t.directionsLabel}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-white/40 mb-6">{t.footerSocial}</h3>
            <div className="flex gap-6">
              <a href="https://www.facebook.com/bisericafaraziduri" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_social', { platform: 'facebook' })} className="text-white/80 hover:text-accent transition-colors text-sm uppercase tracking-widest">FB</a>
              <a href="https://www.instagram.com/church.without.walls/" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_social', { platform: 'instagram' })} className="text-white/80 hover:text-accent transition-colors text-sm uppercase tracking-widest">IG</a>
              <a href="https://www.youtube.com/@Church_Without_Wallsm" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_social', { platform: 'youtube' })} className="text-white/80 hover:text-accent transition-colors text-sm uppercase tracking-widest">YT</a>
            </div>
          </div>
        </div>
        <div className="mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm font-light gap-4">
          <p>© {currentYear} Church Without Walls Chisinau. {t.footerRights}</p>
          <a href="/admin" className="hover:text-accent transition-colors">Admin Login</a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
