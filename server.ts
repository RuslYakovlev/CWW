import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { DEFAULT_YOUTUBE_CHANNEL_ID, DEFAULT_YOUTUBE_CHANNEL_URL, syncYoutubeSermons } from './services/youtubeSync';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const YOUTUBE_SYNC_INTERVAL_MS = 30 * 60 * 1000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const host = req.headers.host || '';
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '');
  const isCwwDomain = /(^|\.)cww\.md(?::\d+)?$/i.test(host);

  if (process.env.NODE_ENV === 'production' && isCwwDomain) {
    const shouldUseNonWww = host.toLowerCase().startsWith('www.');
    const shouldUseHttps = forwardedProto === 'http';

    if (shouldUseNonWww || shouldUseHttps) {
      res.redirect(301, `https://cww.md${req.originalUrl}`);
      return;
    }
  }

  next();
});

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

const sermonSchema = z.object({
  title: z.string().min(1),
  speaker: z.string().min(1),
  imageUrl: z.string().min(1),
  youtubeUrl: z.string().optional().nullable(),
  youtubeId: z.string().optional().nullable(),
  date: z.string().datetime().optional(),
});

const eventSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  dateLabel: z.string().min(1),
  timeLabel: z.string().min(1),
  formatLabel: z.string().min(1),
  imageUrl: z.string().min(1),
});

async function ensureInitialData() {
  const adminExists = await prisma.user.findFirst();
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({ data: { username: 'admin', password: hashedPassword } });
    console.log('Auto-setup: admin user created (admin / admin123)');
  }

  await prisma.settings.upsert({
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

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.create({
      data: {
        title: 'Ближайшее событие',
        subtitle: 'Воскресное богослужение',
        dateLabel: 'Каждое воскресенье',
        timeLabel: '10:00 и 12:00',
        formatLabel: 'Офлайн и онлайн',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
      },
    });
    console.log('Auto-setup: events seeded');
  }
}

app.post('/api/setup', async (req, res) => {
  try {
    const adminExists = await prisma.user.findFirst();
    if (adminExists) return res.status(400).json({ error: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({ data: { username: 'admin', password: hashedPassword } });
    res.json({ message: 'Admin created', username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.get('/api/sermons', async (req, res) => {
  try {
    const sermons = await prisma.sermon.findMany({ orderBy: { date: 'desc' } });
    res.json(sermons);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.post('/api/sermons', authenticateToken, async (req, res) => {
  try {
    const parsed = sermonSchema.parse(req.body);
    const sermon = await prisma.sermon.create({
      data: { ...parsed, date: parsed.date ? new Date(parsed.date) : undefined },
    });
    res.json(sermon);
  } catch (error) {
    res.status(400).json({ error: 'Could not create sermon', details: String(error) });
  }
});

app.put('/api/sermons/:id', authenticateToken, async (req, res) => {
  try {
    const parsed = sermonSchema.parse(req.body);
    const sermon = await prisma.sermon.update({
      where: { id: req.params.id },
      data: { ...parsed, date: parsed.date ? new Date(parsed.date) : undefined },
    });
    res.json(sermon);
  } catch (error) {
    res.status(400).json({ error: 'Could not update sermon', details: String(error) });
  }
});

app.delete('/api/sermons/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.sermon.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const event = await prisma.event.create({ data: eventSchema.parse(req.body) });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: 'Could not create event', details: String(error) });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: eventSchema.parse(req.body),
    });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: 'Could not update event', details: String(error) });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: {},
      create: {
        id: 'global',
        youtubeChannelUrl: DEFAULT_YOUTUBE_CHANNEL_URL,
        youtubeChannelId: DEFAULT_YOUTUBE_CHANNEL_ID,
      },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: req.body,
      create: { id: 'global', ...req.body },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.post('/api/youtube/sync', authenticateToken, async (req, res) => {
  try {
    const result = await syncYoutubeSermons(prisma);
    res.json(result);
  } catch (error) {
    console.error('YouTube sync failed:', error);
    res.status(500).json({ error: 'YouTube sync failed', details: String(error) });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    await ensureInitialData();
    const result = await syncYoutubeSermons(prisma);
    res.json({ message: 'Seeded successfully', youtube: result });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

async function startServer() {
  try {
    await ensureInitialData();
    const result = await syncYoutubeSermons(prisma);
    console.log(`YouTube sync: ${result.created} created, ${result.updated} updated`);
  } catch (error) {
    console.error('Auto-setup failed:', error);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  setInterval(async () => {
    try {
      const result = await syncYoutubeSermons(prisma);
      console.log(`YouTube sync: ${result.created} created, ${result.updated} updated`);
    } catch (error) {
      console.error('Scheduled YouTube sync failed:', error);
    }
  }, YOUTUBE_SYNC_INTERVAL_MS);
}

startServer();
