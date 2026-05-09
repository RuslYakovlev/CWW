import React from 'react';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { Language, Translation } from '../../types';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Container from '../layout/Container';
import { trackEvent } from '../../utils/analytics';

interface ContactPageProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Strada%20Carierei%2C%20MD-2024%2C%20Chisinau%2C%20Moldova';
const mapEmbedUrl = 'https://www.google.com/maps?q=Strada%20Carierei%2C%20MD-2024%2C%20Chisinau%2C%20Moldova&output=embed';

const ContactPage: React.FC<ContactPageProps> = ({ lang, setLang, t }) => {
  const phoneHref = `tel:${t.phone.replace(/\s/g, '')}`;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header lang={lang} setLang={setLang} t={t} />
      <main className="flex-grow pt-32 pb-20">
        <Container>
          <div className="max-w-4xl mb-12">
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Church Without Walls Chisinau</p>
            <h1 className="font-serif text-5xl md:text-7xl text-text tracking-tight">{t.contactPageTitle}</h1>
            <p className="mt-6 text-lg text-text/70 font-light leading-relaxed max-w-3xl">{t.contactPageSubtitle}</p>
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm" aria-labelledby="contact-details-title">
              <h2 id="contact-details-title" className="font-serif text-3xl md:text-4xl text-text mb-8">{t.contactVisitTitle}</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/50 mb-1">{t.footerContacts}</p>
                    <p className="text-text/80 leading-relaxed">{t.address}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/50 mb-1">{t.contactServiceTitle}</p>
                    <p className="text-text/80 leading-relaxed">{t.sundayService}: {t.serviceTimes}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/50 mb-1">{t.phone}</p>
                    <a href={phoneHref} onClick={() => trackEvent('click_phone', { page: 'contact' })} className="text-text/80 hover:text-accent transition-colors">{t.phone}</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/50 mb-1">Email</p>
                    <a href={`mailto:${t.email}`} onClick={() => trackEvent('click_email', { page: 'contact' })} className="text-text/80 hover:text-accent transition-colors">{t.email}</a>
                  </div>
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click_directions', { page: 'contact' })}
                className="mt-10 inline-flex items-center justify-center gap-3 w-full rounded-full bg-text text-white px-6 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors focus:outline-none focus:ring-4 focus:ring-text/20"
              >
                <Navigation className="w-5 h-5" />
                {t.contactOpenInMaps}
              </a>
            </section>

            <section className="bg-white rounded-3xl p-4 shadow-sm" aria-labelledby="contact-map-title">
              <h2 id="contact-map-title" className="sr-only">{t.contactMapTitle}</h2>
              <div className="aspect-[4/3] min-h-[420px] overflow-hidden rounded-2xl bg-secondary">
                <iframe
                  title={t.contactMapTitle}
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer t={t} lang={lang} />
    </div>
  );
};

export default ContactPage;
