import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Language, Translation } from '../../types';
import Logo from '../Logo';
import Container from './Container';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, t }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSolid = isScrolled || !isHome;
  const churchName = lang === 'ro' ? 'Biserica Fara Ziduri' : lang === 'en' ? 'Church Without Walls' : 'Церковь Без Стен';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.navAbout, href: isHome ? '#about' : '/#about' },
    { name: t.navSermons, href: '/sermons' },
    { name: t.navGroups, href: isHome ? '#groups' : '/#groups' },
    { name: t.navGive, href: isHome ? '#give' : '/#give' },
  ];

  const linkClass = `text-sm tracking-widest uppercase transition-colors duration-500 ${
    isSolid ? 'text-text/70 hover:text-text' : 'text-white/80 hover:text-white'
  } relative group`;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid ? 'bg-bg/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <Container>
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="w-12 h-12" light={!isSolid} lang={lang} />
            <span className={`font-serif font-bold text-2xl tracking-wide transition-colors duration-500 ${isSolid ? 'text-text' : 'text-white'}`}>
              {churchName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link key={link.name} to={link.href} className={linkClass}>
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 ease-out ${isSolid ? 'bg-accent' : 'bg-white'}`} />
                </Link>
              ) : (
                <a key={link.name} href={link.href} className={linkClass}>
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 ease-out ${isSolid ? 'bg-accent' : 'bg-white'}`} />
                </a>
              )
            ))}
          </nav>

          <div className={`flex items-center gap-2 text-xs tracking-widest uppercase font-medium transition-colors duration-500 ${isSolid ? 'text-text/60' : 'text-white/60'}`}>
            <button onClick={() => setLang('ru')} className={`transition-colors ${lang === 'ru' ? (isSolid ? 'text-text' : 'text-white') : 'hover:text-accent'}`}>RU</button>
            <span>|</span>
            <button onClick={() => setLang('ro')} className={`transition-colors ${lang === 'ro' ? (isSolid ? 'text-text' : 'text-white') : 'hover:text-accent'}`}>RO</button>
            <span>|</span>
            <button onClick={() => setLang('en')} className={`transition-colors ${lang === 'en' ? (isSolid ? 'text-text' : 'text-white') : 'hover:text-accent'}`}>EN</button>
          </div>
        </div>
      </Container>
    </motion.header>
  );
};

export default Header;
