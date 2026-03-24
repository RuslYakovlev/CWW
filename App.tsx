
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
      <LatestSermons t={t} />
      <Groups t={t} />
      <ChurchLife t={t} />
      <BecomeFamily t={t} />
    </main>
    <Footer t={t} />
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ru');
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicApp lang={lang} setLang={setLang} t={t} />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sermons/:id" element={<SermonEditor />} />
        <Route path="/admin/events/:id" element={<EventEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;