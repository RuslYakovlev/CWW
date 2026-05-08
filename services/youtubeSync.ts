import { XMLParser } from 'fast-xml-parser';
import type { PrismaClient } from '@prisma/client';

export const DEFAULT_YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@Church_Without_Wallsm';
export const DEFAULT_YOUTUBE_CHANNEL_ID = 'UCyOU8yn8sSoUjxCRntVYlbg';

type YoutubeEntry = {
  id?: string;
  title?: string;
  published?: string;
  link?: { '@_href'?: string };
  'yt:videoId'?: string;
  'media:group'?: {
    'media:thumbnail'?: { '@_url'?: string };
  };
};

type SyncedVideo = {
  youtubeId: string;
  title: string;
  imageUrl: string;
  youtubeUrl: string;
  date?: Date;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

const toArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const titleCaseName = (value: string) =>
  value
    .toLocaleLowerCase('ru')
    .replace(/(^|\s)\p{L}/gu, letter => letter.toLocaleUpperCase('ru'));

const decodeJsonString = (value: string) => {
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value;
  }
};

const titleFromAccessibilityLabel = (label: string) => {
  return label
    .replace(/\s+\d+\s+(?:секунд[а-я]*|минут[а-я]*|час[а-я]*|second[s]?|minute[s]?|hour[s]?).*$/i, '')
    .trim();
};

const speakerFromTitle = (title: string) => {
  const parts = title.split('|').map(part => part.trim()).filter(Boolean);
  const pastorPart = parts.find(part => /пастор|pastor/i.test(part));
  if (pastorPart) return pastorPart;

  const isNameCandidate = (part: string) => {
    const normalized = part.toLocaleLowerCase('ru');
    if (/прямая трансляция|церковь|church|live|online/.test(normalized)) return false;
    return /^[\p{L}\s.'-]{3,}$/u.test(part) && part.length <= 40;
  };

  if (parts[0] && isNameCandidate(parts[0])) {
    return titleCaseName(parts[0]);
  }

  const namePart = [...parts].reverse().find(part => {
    return isNameCandidate(part);
  });

  if (namePart) {
    return titleCaseName(namePart);
  }

  return 'Church Without Walls';
};

async function fetchRssVideos(channelId: string): Promise<SyncedVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const response = await fetch(feedUrl, {
    headers: { 'User-Agent': 'Church Without Walls website sync' },
  });

  if (!response.ok) {
    throw new Error(`YouTube feed request failed with ${response.status}`);
  }

  const xml = await response.text();
  const feed = parser.parse(xml)?.feed;
  const entries = toArray<YoutubeEntry>(feed?.entry);

  return entries.flatMap(entry => {
    const youtubeId = entry['yt:videoId'] || entry.id?.replace('yt:video:', '');
    if (!youtubeId || !entry.title) return [];

    return [{
      youtubeId,
      title: entry.title,
      imageUrl: entry['media:group']?.['media:thumbnail']?.['@_url'] || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      youtubeUrl: entry.link?.['@_href'] || `https://www.youtube.com/watch?v=${youtubeId}`,
      date: entry.published ? new Date(entry.published) : new Date(),
    }];
  });
}

async function fetchChannelPageVideos(): Promise<SyncedVideo[]> {
  const response = await fetch(`${DEFAULT_YOUTUBE_CHANNEL_URL}/videos`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
      'Accept-Language': 'ru,en;q=0.8',
    },
  });

  if (!response.ok) return [];

  const html = await response.text();
  const videos = new Map<string, SyncedVideo>();
  const blockPattern = /"contentId":"([^"]+)"[\s\S]{0,1600}?"accessibilityContext":\{"label":"([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(html)) !== null) {
    const youtubeId = match[1];
    const label = titleFromAccessibilityLabel(decodeJsonString(match[2]));
    if (!youtubeId || !label || videos.has(youtubeId)) continue;

    videos.set(youtubeId, {
      youtubeId,
      title: label,
      imageUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    });
  }

  return [...videos.values()];
}

export async function syncYoutubeSermons(prisma: PrismaClient) {
  const settings = await prisma.settings.upsert({
    where: { id: 'global' },
    update: {
      youtubeChannelUrl: DEFAULT_YOUTUBE_CHANNEL_URL,
      youtubeChannelId: DEFAULT_YOUTUBE_CHANNEL_ID,
    },
    create: {
      id: 'global',
      youtubeChannelUrl: DEFAULT_YOUTUBE_CHANNEL_URL,
      youtubeChannelId: DEFAULT_YOUTUBE_CHANNEL_ID,
    },
  });

  const channelId = settings.youtubeChannelId || DEFAULT_YOUTUBE_CHANNEL_ID;
  const rssVideos = await fetchRssVideos(channelId);
  const pageVideos = await fetchChannelPageVideos();
  const videos = new Map<string, SyncedVideo>();
  const oldestRssDate = rssVideos
    .map(video => video.date?.getTime() || 0)
    .filter(Boolean)
    .reduce((oldest, value) => Math.min(oldest, value), Date.now());

  rssVideos.forEach(video => videos.set(video.youtubeId, video));
  pageVideos.forEach((video, index) => {
    const existing = videos.get(video.youtubeId);
    videos.set(video.youtubeId, {
      ...video,
      ...existing,
      date: existing?.date || new Date(oldestRssDate - (index + 1) * 24 * 60 * 60 * 1000),
    });
  });

  let created = 0;
  let updated = 0;

  for (const video of videos.values()) {
    const data = {
      title: video.title,
      speaker: speakerFromTitle(video.title),
      imageUrl: video.imageUrl,
      youtubeUrl: video.youtubeUrl,
      date: video.date || new Date(),
    };

    const existing = await prisma.sermon.findUnique({ where: { youtubeId: video.youtubeId } });
    if (existing) {
      await prisma.sermon.update({ where: { youtubeId: video.youtubeId }, data });
      updated += 1;
    } else {
      await prisma.sermon.create({ data: { ...data, youtubeId: video.youtubeId } });
      created += 1;
    }
  }

  await prisma.settings.update({
    where: { id: 'global' },
    data: {
      youtubeChannelUrl: DEFAULT_YOUTUBE_CHANNEL_URL,
      youtubeChannelId: channelId,
      lastYoutubeSyncAt: new Date(),
    },
  });

  return { created, updated, total: videos.size, channelId };
}
