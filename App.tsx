
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Language } from './types';
import { translations } from './translations';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Hero from './components/sections/Hero';
import AboutBrief from './components/sections/AboutBrief';
import LatestSermons from './components/sections/LatestSermons';
import Groups from './components/sections/Groups';
import ChurchLife from './components/sections/ChurchLife';
import BecomeFamily from './components/sections/BecomeFamily';
import SermonsPage from './components/pages/SermonsPage';
import LocalSeo from './components/sections/LocalSeo';
import Seo from './components/seo/Seo';
import ContactPage from './components/pages/ContactPage';

import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import SermonEditor from './components/admin/SermonEditor';
import EventEditor from './components/admin/EventEditor';

const PublicApp: React.FC<{ lang: Language, setLang: (l: Language) => void, t: any }> = ({ lang, setLang, t }) => (
  <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
    <Header lang={lang} setLang={setLang} t={t} />
    <main className="flex-grow">
      <Hero t={t} />
      <AboutBrief t={t} />
      <LocalSeo t={t} />
      <LatestSermons t={t} />
      <Groups t={t} />
      <ChurchLife t={t} />
      <BecomeFamily t={t} />
    </main>
    <Footer t={t} lang={lang} />
  </div>
);

const App: React.FC = () => {
  const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') return 'ru';
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    return urlLang === 'en' || urlLang === 'ro' || urlLang === 'ru' ? urlLang : 'ru';
  };

  const [lang, setLangState] = useState<Language>(getInitialLanguage);
  const t = translations[lang];

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLang);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <BrowserRouter>
      <Seo lang={lang} />
      <Routes>
        <Route path="/" element={<PublicApp lang={lang} setLang={setLang} t={t} />} />
        <Route path="/sermons" element={<SermonsPage lang={lang} setLang={setLang} t={t} />} />
        <Route path="/contact" element={<ContactPage lang={lang} setLang={setLang} t={t} />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sermons/:id" element={<SermonEditor />} />
        <Route path="/admin/events/:id" element={<EventEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
