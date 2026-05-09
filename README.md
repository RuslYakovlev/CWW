# Church Without Walls Chisinau

React/Vite + Express project for the Church Without Walls website, with YouTube sermon sync and a multilingual public site.

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run sync:youtube
```

## SEO Report

### What Changed

- Added technical SEO metadata for the public site: `title`, `description`, canonical URL, `robots`, Open Graph and Twitter Card tags.
- Added dynamic SEO updates for `/` and `/sermons` in RU/RO/EN, driven by the selected language.
- Added static fallback metadata and JSON-LD to `index.html` so crawlers have useful data before the React app runs.
- Added `robots.txt` and `sitemap.xml`.
- Added hreflang links for English, Russian and Romanian variants.
- Added Schema.org JSON-LD for `Organization` + `Church` on the homepage.
- Added `CollectionPage` and `VideoObject` structured data for the sermons catalog.
- Added a public contact page with address, phone, email, service schedule, embedded map and GPS directions.
- Added a local SEO content block on the homepage for Chisinau and Moldova.
- Updated the homepage H1 per language:
  - EN: `Christian Church in Chisinau, Moldova`
  - RU: `Христианская церковь в Кишинёве`
  - RO: `Biserică creștină în Chișinău`
- Rewrote translations in valid UTF-8 and removed mojibake from the public UI.
- Added descriptive alt text for important public images.
- Added GA4/GTM/Search Console environment variable support.
- Added basic analytics event hooks for phone, email, social links, directions, contact form submit, visit church and watch online clicks.
- Added production redirect middleware for `www.cww.md` → `cww.md` and HTTP → HTTPS when the request is already on the `cww.md` domain.

### Files Changed

- `index.html`
- `App.tsx`
- `translations.ts`
- `types.ts`
- `vite.config.ts`
- `server.ts`
- `components/seo/Seo.tsx`
- `components/sections/LocalSeo.tsx`
- `components/sections/Hero.tsx`
- `components/sections/LatestSermons.tsx`
- `components/sections/Groups.tsx`
- `components/sections/ChurchLife.tsx`
- `components/sections/BecomeFamily.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/pages/SermonsPage.tsx`
- `components/pages/ContactPage.tsx`
- `components/sermons/SermonCard.tsx`
- `utils/seo.ts`
- `utils/analytics.ts`
- `public/robots.txt`
- `public/sitemap.xml`
- `.env.example`

### Sitemap Pages

- `https://cww.md/`
- `https://cww.md/?lang=en`
- `https://cww.md/?lang=ru`
- `https://cww.md/?lang=ro`
- `https://cww.md/sermons`
- `https://cww.md/contact`

### Metadata

Homepage English:

- Title: `Church Without Walls | Christian Church in Chisinau, Moldova`
- Description: `Church Without Walls is a Christian church in Chisinau, Moldova. Join our worship services, community events and online messages.`

Homepage Russian:

- Title: `Church Without Walls | Христианская церковь в Кишинёве`
- Description: `Church Without Walls — христианская церковь в Кишинёве, Молдова. Богослужения, общение, события, проповеди и христианское сообщество.`

Homepage Romanian:

- Title: `Church Without Walls | Biserică creștină în Chișinău`
- Description: `Church Without Walls este o biserică creștină în Chișinău, Moldova. Servicii de închinare, comunitate, evenimente și mesaje online.`

Sermons page:

- EN: `Church Without Walls Messages | Sermons in Chisinau, Moldova`
- RU: `Проповеди Church Without Walls | Христианские проповеди Кишинёв`
- RO: `Predici Church Without Walls | Mesaje creștine Chișinău`

Contact page:

- EN: `Contact Church Without Walls | Christian Church in Chisinau`
- RU: `Контакты Church Without Walls | Христианская церковь в Кишинёве`
- RO: `Contact Church Without Walls | Biserică creștină în Chișinău`

### Languages And Hreflang

Languages detected and supported:

- `en`
- `ru`
- `ro`
- `x-default`

The site uses query-based language URLs such as `/?lang=ru` and `/sermons?lang=ro` so crawlers can receive separate localized metadata and content while the existing UI remains intact.

### Manual Data To Confirm

- Confirm the exact public street address formatting for Google Business Profile.
- Confirm whether the phone number `+373 76 372 552` and email `office@cww.md` should be public in all markets.
- Confirm the exact service duration for `openingHours`; the current structured data uses Sunday `10:00-13:30`.
- Add a dedicated Google Maps place URL when the Google Business Profile is ready.

### After Deployment

- Add `cww.md` to Google Search Console.
- Confirm the domain through a DNS TXT record at the domain registrar.
- Submit `https://cww.md/sitemap.xml`.
- Check indexing status in Search Console.
- Test the homepage with Google Rich Results Test.
- Run PageSpeed Insights for mobile and desktop.
- Create or update the Google Business Profile for Church Without Walls in Chisinau, Moldova.
- Add website, address, phone, service schedule and social links to Google Business Profile.
- Check the organization display in Google Maps.

## Environment Variables

```bash
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

If `NEXT_PUBLIC_GTM_ID` is set, GTM is loaded and direct GA4 is not loaded to avoid duplicate analytics. If GTM is empty and `NEXT_PUBLIC_GA_ID` is set, GA4 loads directly through `gtag.js`.
