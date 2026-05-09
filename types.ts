
export type Language = 'ru' | 'ro' | 'en';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  imageUrl: string;
  youtubeId?: string | null;
  youtubeUrl?: string | null;
  date: string;
}

export interface Translation {
  // Header
  navAbout: string;
  navSermons: string;
  navEvents: string;
  navGroups: string;
  navContact: string;
  navGive: string;
  ctaHeader: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroImageAlt: string;
  ctaJoin: string;
  ctaWatchOnline: string;

  // About Brief
  aboutBriefTitle: string;
  whoWeAre: string;
  whoWeAreText: string;
  whatWeBelieve: string;
  whatWeBelieveText: string;
  ourMission: string;
  ourMissionText: string;
  localSeoTitle: string;
  localSeoText: string;

  // Upcoming Event
  upcomingEventTitle: string;
  addToCalendar: string;

  // Latest Sermons
  latestSermonsTitle: string;
  allSermons: string;
  sermon1Title: string;
  sermon1Speaker: string;
  sermon2Title: string;
  sermon2Speaker: string;
  sermon3Title: string;
  sermon3Speaker: string;

  // Church Life
  churchLifeTitle: string;
  churchLifeSubtitle: string;

  // Groups
  groupsTitle: string;
  groupsSubtitle: string;
  groupsTime: string;
  groupsLocation: string;

  // Become Family
  becomeFamilyTitle: string;
  becomeFamilyText: string;
  yourName: string;
  yourPhone: string;
  send: string;

  // Footer
  footerRights: string;
  footerNavigation: string;
  footerContacts: string;
  footerSocial: string;
  footerTagline: string;

  // Contact Info
  address: string;
  phone: string;
  email: string;
  directionsLabel: string;

  // Contact page
  contactPageTitle: string;
  contactPageSubtitle: string;
  contactVisitTitle: string;
  contactServiceTitle: string;
  contactMapTitle: string;
  contactOpenInMaps: string;

  // Event Details
  sundayService: string;
  serviceTimes: string;
  dateLabel: string;
  timeLabel: string;
  formatLabel: string;
  everySunday: string;
  offlineOnline: string;

  // FIX: Add missing translation keys for the chat assistant.
  // Chat Assistant
  assistantGreeting: string;
  assistantTitle: string;
  assistantPlaceholder: string;

  // Sermons catalog
  sermonsPageTitle: string;
  sermonsSearchPlaceholder: string;
  sortNewest: string;
  sortPopular: string;
  sortOldest: string;
  watchSermon: string;
  closePlayer: string;
  noSermonsFound: string;
  loadingSermons: string;
}
