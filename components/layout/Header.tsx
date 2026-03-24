
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Language, Translation } from '../../types';
import Logo from '../Logo';
import Button from '../ui/Button';
import Container from './Container';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, t }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.navAbout, href: '#about' },
    { name: t.navSermons, href: '#sermons' },
    { name: t.navEvents, href: '#events' },
    { name: t.navGroups, href: '#groups' },
    { name: t.navGive, href: '#give' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-bg/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <Container>
        <div className="flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3">
            <Logo className="w-10 h-10" light={!isScrolled} />
            <span className={`font-serif font-bold text-2xl tracking-wide transition-colors duration-500 ${isScrolled ? 'text-text' : 'text-white'}`}>
              Church Without Walls
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm tracking-widest uppercase transition-colors duration-500 ${isScrolled ? 'text-text/70 hover:text-text' : 'text-white/80 hover:text-white'} relative group`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 ease-out ${isScrolled ? 'bg-accent' : 'bg-white'}`}></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 text-xs tracking-widest uppercase font-medium transition-colors duration-500 ${isScrolled ? 'text-text/60' : 'text-white/60'}`}>
              <button onClick={() => setLang('ru')} className={`transition-colors ${lang === 'ru' ? (isScrolled ? 'text-text' : 'text-white') : 'hover:text-accent'}`}>RU</button>
              <span>|</span>
              <button onClick={() => setLang('ro')} className={`transition-colors ${lang === 'ro' ? (isScrolled ? 'text-text' : 'text-white') : 'hover:text-accent'}`}>RO</button>
            </div>
          </div>
        </div>
      </Container>
    </motion.header>
  );
};

export default Header;
