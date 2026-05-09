import { Language } from '../types';

export const SITE_URL = 'https://cww.md';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-ru-full.png`;

export const socialLinks = [
  'https://www.facebook.com/bisericafaraziduri',
  'https://www.instagram.com/church.without.walls/',
  'https://www.youtube.com/@Church_Without_Wallsm',
];

const homeSeo = {
  en: {
    title: 'Church Without Walls | Christian Church in Chisinau, Moldova',
    description: 'Church Without Walls is a Christian church in Chisinau, Moldova. Join our worship services, community events and online messages.',
    ogTitle: 'Church Without Walls | Christian Church in Chisinau',
    ogDescription: 'Christian church and community in Chisinau, Moldova. Worship services, events, messages and online church content.',
  },
  ru: {
    title: 'Church Without Walls | Христианская церковь в Кишинёве',
    description: 'Church Without Walls — христианская церковь в Кишинёве, Молдова. Богослужения, общение, события, проповеди и христианское сообщество.',
    ogTitle: 'Church Without Walls | Христианская церковь в Кишинёве',
    ogDescription: 'Христианская церковь и сообщество в Кишинёве, Молдова. Богослужения, события, проповеди и онлайн-материалы.',
  },
  ro: {
    title: 'Church Without Walls | Biserică creștină în Chișinău',
    description: 'Church Without Walls este o biserică creștină în Chișinău, Moldova. Servicii de închinare, comunitate, evenimente și mesaje online.',
    ogTitle: 'Church Without Walls | Biserică creștină în Chișinău',
    ogDescription: 'Biserică și comunitate creștină în Chișinău, Moldova. Servicii de închinare, evenimente, predici și conținut online.',
  },
} satisfies Record<Language, { title: string; description: string; ogTitle: string; ogDescription: string }>;

const sermonsSeo = {
  en: {
    title: 'Church Without Walls Messages | Sermons in Chisinau, Moldova',
    description: 'Watch Church Without Walls sermons, Christian messages and online church content from Chisinau, Moldova.',
    ogTitle: 'Church Without Walls Sermons',
    ogDescription: 'Christian messages, sermons and online church content from Chisinau, Moldova.',
  },
  ru: {
    title: 'Проповеди Church Without Walls | Христианские проповеди Кишинёв',
    description: 'Смотрите проповеди Church Without Walls, христианские послания и онлайн-материалы церкви из Кишинёва, Молдова.',
    ogTitle: 'Проповеди Church Without Walls',
    ogDescription: 'Христианские проповеди, послания и онлайн-материалы церкви из Кишинёва, Молдова.',
  },
  ro: {
    title: 'Predici Church Without Walls | Mesaje creștine Chișinău',
    description: 'Urmărește predici Church Without Walls, mesaje creștine și conținut online al bisericii din Chișinău, Moldova.',
    ogTitle: 'Predici Church Without Walls',
    ogDescription: 'Predici, mesaje creștine și conținut online al bisericii din Chișinău, Moldova.',
  },
} satisfies Record<Language, { title: string; description: string; ogTitle: string; ogDescription: string }>;

export const localeByLanguage: Record<Language, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  ro: 'ro_MD',
};

export const getPageSeo = (pathname: string, lang: Language) => {
  const isSermonsPage = pathname === '/sermons';
  const seo = isSermonsPage ? sermonsSeo[lang] : homeSeo[lang];
  const canonicalPath = isSermonsPage ? '/sermons' : '/';

  return {
    ...seo,
    canonicalPath,
    type: isSermonsPage ? 'website' : 'website',
  };
};

export const getLocalizedUrl = (pathname: string, lang: Language) => {
  const normalizedPath = pathname === '/sermons' ? '/sermons' : '/';
  const separator = normalizedPath === '/' ? '?' : '?';
  return `${SITE_URL}${normalizedPath}${separator}lang=${lang}`;
};

export const getCanonicalUrl = (pathname: string, lang: Language, hasExplicitLang: boolean) => {
  const normalizedPath = pathname === '/sermons' ? '/sermons' : '/';
  if (!hasExplicitLang) return `${SITE_URL}${normalizedPath}`;
  return getLocalizedUrl(normalizedPath, lang);
};
