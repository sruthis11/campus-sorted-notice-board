import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { seedNotices, type Notice, type NoticeConflict, type Registration } from './shared/notices.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsing with limits to prevent payload attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Simple in-memory rate limiter for anti-abuse
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function rateLimiter(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({
        error: 'Too many requests. Please slow down.',
        retryAfterMs: entry.resetAt - now
      });
    }

    entry.count++;
    next();
  };
}

// Input sanitization helper
function sanitizeString(str: any): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // remove HTML tags
    .trim()
    .slice(0, 1000); // length safeguard
}

// Notice schema and seed data live in shared/notices.ts
let notices: Notice[] = structuredClone(seedNotices);

// Registrations store
let registrations: Registration[] = [];

// API Endpoints

// 1. Get all notices
app.get('/api/notices', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: notices.length,
    notices
  });
});

// 2. Get single notice by ID
app.get('/api/notices/:id', (req: Request, res: Response) => {
  const notice = notices.find(n => n.id === req.params.id);
  if (!notice) {
    return res.status(404).json({ success: false, error: 'Notice not found' });
  }
  res.json({ success: true, notice });
});

// 3. Post a new pinned notice (with validation)
app.post('/api/notices', rateLimiter(20, 60000), (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      handNote,
      category,
      subcategory,
      tag,
      paperColor,
      pinType,
      tapeType,
      date,
      isoDate,
      startTime,
      endTime,
      venue,
      regDeadline,
      prerequisites,
      capacity,
      contact
    } = req.body;

    if (!title || !category || !date || !venue) {
      return res.status(400).json({ success: false, error: 'Title, category, date, and venue are required.' });
    }

    const cleanTitle = sanitizeString(title);
    const cleanSubtitle = sanitizeString(subtitle || cleanTitle);
    const cleanHandNote = sanitizeString(handNote || cleanSubtitle);
    const cleanCategory = sanitizeString(category).toUpperCase();
    const cleanSubcategory = sanitizeString(subcategory || 'CAMPUS EVENT');
    const cleanVenue = sanitizeString(venue);
    const cleanDate = sanitizeString(date);
    const cleanContact = sanitizeString(contact || 'campus-office@campus.edu');

    // Auto-compute random tactile rotation (-3.0 to +3.0 deg)
    const randomRotation = Number((Math.random() * 6 - 3).toFixed(1));

    const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `notice-${Date.now()}`;

    // Conflict detection engine check
    let computedConflict: NoticeConflict | null = null;
    const sameDayNotices = notices.filter(n => n.isoDate === (isoDate || '2025-04-01'));
    if (sameDayNotices.length > 0) {
      const conflicting = sameDayNotices[0];
      computedConflict = {
        level: 'caution',
        title: 'Schedule overlap warning',
        description: `Another campus event (${conflicting.title}) takes place on the same date at ${conflicting.startTime}. Check building distances.`
      };
    }

    const newNotice: Notice = {
      id,
      title: cleanTitle,
      subtitle: cleanSubtitle,
      handNote: cleanHandNote,
      category: cleanCategory,
      subcategory: cleanSubcategory,
      tag: tag ? sanitizeString(tag).toUpperCase() : undefined,
      paperColor: paperColor || 'yellow',
      pinType: pinType || 'red-pushpin',
      tapeType: tapeType || 'none',
      rotation: randomRotation,
      date: cleanDate,
      isoDate: isoDate || '2025-04-01',
      startTime: sanitizeString(startTime || '10:00 AM'),
      endTime: sanitizeString(endTime || '12:00 PM'),
      venue: cleanVenue,
      regDeadline: sanitizeString(regDeadline || 'Walk-ins welcome'),
      conflictNotice: computedConflict,
      prerequisites: Array.isArray(prerequisites) && prerequisites.length > 0 
        ? prerequisites.map((p: any) => sanitizeString(p)) 
        : ['Open to all students', 'No prerequisites required'],
      capacity: Number(capacity) || 100,
      registeredCount: 0,
      contact: cleanContact
    };

    notices.unshift(newNotice);

    res.status(201).json({
      success: true,
      message: 'Notice pinned successfully to the board!',
      notice: newNotice
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to create notice: ' + err.message });
  }
});

// 4. Intelligent notice decoder (Takes raw flyer text/bullet points and extracts structured fields)
app.post('/api/notices/decode', (req: Request, res: Response) => {
  const { rawText } = req.body;
  if (!rawText || typeof rawText !== 'string') {
    return res.status(400).json({ success: false, error: 'Raw text is required to decode.' });
  }

  const clean = sanitizeString(rawText);
  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  const titleCandidate = lines[0] || 'Decoded Campus Session';
  const subCandidate = lines[1] || 'Parsed notice information extracted from notice board.';
  
  // Date heuristic
  const dateMatch = clean.match(/(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i) 
    || clean.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);
  const dateExtracted = dateMatch ? dateMatch[0] : '15 April 2025';

  // Venue heuristic
  const venueMatch = clean.match(/(?:at|venue|location|room|hall|lab|auditorium)[\s:]+([^\n,\.]+)/i);
  const venueExtracted = venueMatch ? venueMatch[1].trim() : 'Seminar Hall 1';

  // Time heuristic
  const timeMatch = clean.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);
  const timeExtracted = timeMatch ? timeMatch[0] : '3:00 PM';

  res.json({
    success: true,
    decoded: {
      title: titleCandidate,
      subtitle: subCandidate,
      handNote: subCandidate.slice(0, 70),
      category: 'DECODED EVENT',
      subcategory: 'ACADEMIC & CLUB',
      date: dateExtracted,
      isoDate: '2025-04-15',
      startTime: timeExtracted,
      endTime: '5:00 PM',
      venue: venueExtracted,
      regDeadline: 'Walk-ins welcome',
      paperColor: 'mint',
      pinType: 'red-pushpin',
      tapeType: 'kraft-tape',
      prerequisites: ['Valid student ID', 'Open seating', 'Notebook or laptop suggested']
    }
  });
});

// 5. Register for an event
app.post('/api/registrations', rateLimiter(15, 60000), (req: Request, res: Response) => {
  const { noticeId, name, studentId, email } = req.body;

  if (!noticeId || !name || !email) {
    return res.status(400).json({ success: false, error: 'Event ID, full name, and email are required.' });
  }

  const notice = notices.find(n => n.id === noticeId);
  if (!notice) {
    return res.status(404).json({ success: false, error: 'Event not found.' });
  }

  const cleanEmail = sanitizeString(email).toLowerCase();
  const cleanName = sanitizeString(name);
  const cleanStudentId = sanitizeString(studentId || 'GEN-STU');

  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  // Check duplicate
  const existing = registrations.find(r => r.noticeId === noticeId && r.email === cleanEmail);
  if (existing) {
    return res.json({
      success: true,
      message: 'You are already registered for this event.',
      registration: existing,
      notice
    });
  }

  // Generate unique pass token
  const ticketId = `PASS-${noticeId.slice(0, 4).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const reg: Registration = {
    ticketId,
    noticeId,
    name: cleanName,
    studentId: cleanStudentId,
    email: cleanEmail,
    createdAt: new Date().toISOString()
  };

  registrations.push(reg);
  notice.registeredCount += 1;
  notice.isRegistered = true;

  res.status(201).json({
    success: true,
    message: 'Registration confirmed! Event pass generated.',
    registration: reg,
    notice
  });
});

// 6. Get registrations
app.get('/api/registrations', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: registrations.length,
    registrations
  });
});

// 7. Generate RFC 5545 iCalendar .ics file download
app.get('/api/calendar/ics/:id', (req: Request, res: Response) => {
  const notice = notices.find(n => n.id === req.params.id);
  if (!notice) {
    return res.status(404).send('Event not found');
  }

  // Parse ISO date
  const cleanIso = notice.isoDate ? notice.isoDate.replace(/-/g, '') : '20250401';
  const startStamp = `${cleanIso}T100000Z`;
  const endStamp = `${cleanIso}T120000Z`;
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Sorted//Interactive Notice Board//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${notice.id}-${Date.now()}@campussorted.internal`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${notice.title} (${notice.category})`,
    `DESCRIPTION:${notice.subtitle.replace(/\n/g, ' ')}`,
    `LOCATION:${notice.venue}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${notice.id}.ics"`);
  res.send(icsContent);
});

// 8. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Vite Middleware integration for development and Static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Sorted server listening on port ${PORT} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
