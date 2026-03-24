import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());

// --- Auth Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// --- API Routes ---

// Setup initial admin user if none exists
app.post('/api/setup', async (req, res) => {
  try {
    const adminExists = await prisma.user.findFirst();
    if (adminExists) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({
      data: { username: 'admin', password: hashedPassword },
    });
    res.json({ message: 'Admin created', username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user) {
      console.log(`User ${username} not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log(`Password mismatch for user ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    console.log(`Login successful for user ${username}`);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

// Sermons
app.get('/api/sermons', async (req, res) => {
  try {
    const sermons = await prisma.sermon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(sermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

app.post('/api/sermons', authenticateToken, async (req, res) => {
  try {
    const sermon = await prisma.sermon.create({ data: req.body });
    res.json(sermon);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/sermons/:id', authenticateToken, async (req, res) => {
  try {
    const sermon = await prisma.sermon.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(sermon);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/sermons/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.sermon.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const event = await prisma.event.create({ data: req.body });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: 'global', youtubeChannelUrl: '' } });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
  }
});

// Seed Initial Data
app.post('/api/seed', async (req, res) => {
  try {
    const sermonCount = await prisma.sermon.count();
    if (sermonCount === 0) {
      await prisma.sermon.createMany({
        data: [
          { title: "Жизнь по духу", speaker: "Пастор Евгений Адвахов", imageUrl: "https://placehold.co/800x600/FF5722/FFFFFF?text=ЖИЗНЬ+ПО+ДУХУ%0AПАСТОР+ЕВГЕНИЙ+АДВАХОВ" },
          { title: "Где вера ваша? или В какого Бога ты веришь?", speaker: "Пастор Александр Белев", imageUrl: "https://placehold.co/800x600/FF9800/FFFFFF?text=ГДЕ+ВЕРА+ВАША?%0AПастор+Александр+Белев" },
          { title: "За пределами шаблонов", speaker: "Радион Вельчев", imageUrl: "https://placehold.co/800x600/E0E0E0/000000?text=ЗА+ПРЕДЕЛАМИ+ШАБЛОНОВ%0AРАДИОН+ВЕЛЬЧЕВ" },
        ]
      });
    }
    
    const eventCount = await prisma.event.count();
    if (eventCount === 0) {
      await prisma.event.create({
        data: {
          title: "Ближайшее событие",
          subtitle: "Воскресное Богослужение",
          dateLabel: "Каждое воскресенье",
          timeLabel: "10:00 и 12:00",
          formatLabel: "Офлайн и Онлайн",
          imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200"
        }
      });
    }
    res.json({ message: 'Seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Vite Integration ---
async function startServer() {
  // Auto-setup admin and seed data on startup
  try {
    const adminExists = await prisma.user.findFirst();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: { username: 'admin', password: hashedPassword },
      });
      console.log('Auto-setup: Admin user created');
    }

    const sermonCount = await prisma.sermon.count();
    if (sermonCount === 0) {
      await prisma.sermon.createMany({
        data: [
          { title: "Жизнь по духу", speaker: "Пастор Евгений Адвахов", imageUrl: "https://placehold.co/800x600/FF5722/FFFFFF?text=ЖИЗНЬ+ПО+ДУХУ%0AПАСТОР+ЕВГЕНИЙ+АДВАХОВ" },
          { title: "Где вера ваша? или В какого Бога ты веришь?", speaker: "Пастор Александр Белев", imageUrl: "https://placehold.co/800x600/FF9800/FFFFFF?text=ГДЕ+ВЕРА+ВАША?%0AПастор+Александр+Белев" },
          { title: "За пределами шаблонов", speaker: "Радион Вельчев", imageUrl: "https://placehold.co/800x600/E0E0E0/000000?text=ЗА+ПРЕДЕЛАМИ+ШАБЛОНОВ%0AРАДИОН+ВЕЛЬЧЕВ" },
        ]
      });
      console.log('Auto-setup: Sermons seeded');
    }
    
    const eventCount = await prisma.event.count();
    if (eventCount === 0) {
      await prisma.event.create({
        data: {
          title: "Ближайшее событие",
          subtitle: "Воскресное Богослужение",
          dateLabel: "Каждое воскресенье",
          timeLabel: "10:00 и 12:00",
          formatLabel: "Офлайн и Онлайн",
          imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200"
        }
      });
      console.log('Auto-setup: Events seeded');
    }
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
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
