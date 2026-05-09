import { useEffect, type FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '../../types';
import { GA_ID, GOOGLE_SITE_VERIFICATION, GTM_ID } from '../../utils/analytics';
import { DEFAULT_OG_IMAGE, getCanonicalUrl, getLocalizedUrl, getPageSeo, localeByLanguage, SITE_URL, socialLinks } from '../../utils/seo';

interface SeoProps {
  lang: Language;
}

const setMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
};

const setLink = (id: string, attrs: Record<string, string>) => {
  const selector = attrs.rel === 'canonical'
    ? 'link[rel="canonical"]'
    : attrs.rel === 'alternate' && attrs.hreflang
      ? `link[rel="alternate"][hreflang="${attrs.hreflang}"]`
      : `link[data-seo="${id}"]`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  element.dataset.seo = id;
  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
};

const setJsonLd = (id: string, data: unknown) => {
  let element = document.getElementById(id) as HTMLScriptElement | null;
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
};

const injectAnalytics = () => {
  if (GTM_ID && !document.getElementById('gtm-script')) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript';
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(GTM_ID)}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
    return;
  }

  if (!GTM_ID && GA_ID && !document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args as unknown as Record<string, unknown>);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }
};

const Seo: FC<SeoProps> = ({ lang }) => {
  const location = useLocation();

  useEffect(() => {
    const seo = getPageSeo(location.pathname, lang);
    const params = new URLSearchParams(location.search);
    const hasExplicitLang = params.has('lang');
    const canonicalUrl = getCanonicalUrl(location.pathname, lang, hasExplicitLang);
    const pageUrl = canonicalUrl;

    document.title = seo.title;

    setMeta('meta[name="description"]', { name: 'description', content: seo.description });
    setMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: seo.ogTitle });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: seo.ogDescription });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_OG_IMAGE });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: pageUrl });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: localeByLanguage[lang] });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.ogTitle });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.ogDescription });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: DEFAULT_OG_IMAGE });

    if (GOOGLE_SITE_VERIFICATION) {
      setMeta('meta[name="google-site-verification"]', { name: 'google-site-verification', content: GOOGLE_SITE_VERIFICATION });
    }

    setLink('canonical', { rel: 'canonical', href: canonicalUrl });
    (['en', 'ru', 'ro'] as Language[]).forEach(language => {
      setLink(`alternate-${language}`, {
        rel: 'alternate',
        hreflang: language,
        href: getLocalizedUrl(location.pathname, language),
      });
    });
    setLink('alternate-default', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_URL}${seo.canonicalPath}`,
    });

    if (seo.canonicalPath === '/') {
      setJsonLd('church-jsonld', {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'Church'],
        name: 'Church Without Walls',
        url: SITE_URL,
        image: DEFAULT_OG_IMAGE,
        logo: `${SITE_URL}/logo-ru-symbol.png`,
        telephone: '+37376372552',
        email: 'office@cww.md',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Strada Carierei',
          postalCode: 'MD-2024',
          addressLocality: 'Chisinau',
          addressCountry: 'MD',
        },
        areaServed: 'Moldova',
        location: {
          '@type': 'Place',
          name: 'Church Without Walls Chisinau',
          address: 'Strada Carierei, MD-2024, Chisinau, Moldova',
        },
        openingHours: ['Su 10:00-13:30'],
        sameAs: socialLinks,
      });
    } else if (seo.canonicalPath === '/contact') {
      setJsonLd('church-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: seo.title,
        description: seo.description,
        url: canonicalUrl,
        mainEntity: {
          '@type': ['Organization', 'Church'],
          name: 'Church Without Walls',
          url: SITE_URL,
          telephone: '+37376372552',
          email: 'office@cww.md',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Strada Carierei',
            postalCode: 'MD-2024',
            addressLocality: 'Chisinau',
            addressCountry: 'MD',
          },
          openingHours: ['Su 10:00-13:30'],
          sameAs: socialLinks,
        },
      });
    } else {
      setJsonLd('church-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: seo.title,
        description: seo.description,
        url: canonicalUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Church Without Walls',
          url: SITE_URL,
        },
      });
    }

    injectAnalytics();
  }, [lang, location.pathname, location.search]);

  return null;
};

export default Seo;
