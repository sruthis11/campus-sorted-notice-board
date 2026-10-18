import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

// Notice Data Schema
export interface NoticeConflict {
  level: 'warning' | 'caution' | 'info';
  title: string;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  subtitle: string;
  handNote: string;
  category: string;
  subcategory: string;
  tag?: string;
  paperColor: 'yellow' | 'mint' | 'lilac' | 'cream' | 'white' | 'card' | 'pink' | 'kraft';
  pinType: 'red-pushpin' | 'metal-paperclip' | 'purple-pin' | 'wood-clip' | 'green-pushpin' | 'dual-pins' | 'yellow-pin';
  tapeType?: 'pink-washi' | 'kraft-tape' | 'amber-tape' | 'none';
  rotation: number;
  date: string;
  isoDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  regDeadline: string;
  urgency?: 'urgent' | 'soon' | 'distant';
  conflictNotice?: NoticeConflict | null;
  prerequisites: string[];
  capacity: number;
  registeredCount: number;
  contact: string;
  isRegistered?: boolean;
}

// Seed initial dataset (matching the video's board notices)
let notices: Notice[] = [
  {
    id: 'project-expo',
    title: 'Project Expo',
    subtitle: 'A campus-wide showcase for student ideas, working prototypes, and research projects. Selected teams get a dedicated booth and a three-minute jury pitch.',
    handNote: 'Show your boldest build to founders, faculty, and fellow makers.',
    category: 'INNOVATE 2025',
    subcategory: 'CAMPUS EXHIBITION',
    tag: 'DUE TONIGHT',
    paperColor: 'yellow',
    pinType: 'red-pushpin',
    tapeType: 'pink-washi',
    rotation: -1.8,
    date: '28 March 2025',
    isoDate: '2025-03-28',
    startTime: '10:00 AM',
    endTime: '4:30 PM',
    venue: 'Innovation Hall, Block C',
    regDeadline: '26 March 2025 · 11:59 PM (TONIGHT)',
    urgency: 'urgent',
    conflictNotice: {
      level: 'warning',
      title: 'Schedule conflict detected',
      description: 'Coding Competition clash at 2:00 PM while Expo judging runs 1:00 PM - 3:30 PM'
    },
    prerequisites: ['Working prototype or visual demo', 'One-page project abstract', 'Open to all engineering & design departments'],
    capacity: 60,
    registeredCount: 48,
    contact: 'innovate-club@campus.edu'
  },
  {
    id: 'code-sprint',
    title: 'Code Sprint',
    subtitle: 'Five hours. Four challenges. Leaderboard. Compete in algorithms, data structures, and edge-case optimization for prizes.',
    handNote: 'Five hours. Four challenges. Live leaderboard.',
    category: 'ACM PRESENTS',
    subcategory: 'HACKATHON',
    tag: 'HIGH STAKES',
    paperColor: 'mint',
    pinType: 'metal-paperclip',
    tapeType: 'none',
    rotation: 1.4,
    date: '29 March 2025',
    isoDate: '2025-03-29',
    startTime: '1:00 PM',
    endTime: '6:00 PM',
    venue: 'Lab 3, Computing Center',
    regDeadline: '28 March 2025 · 5:00 PM (TOMORROW)',
    urgency: 'urgent',
    conflictNotice: {
      level: 'warning',
      title: 'Lab 3 Capacity Alert',
      description: 'Seats capped at 80 participants. Bring your own laptop charger.'
    },
    prerequisites: ['HackerRank / GitHub account', 'Languages: C++, Python, or Rust', 'Individual participation only'],
    capacity: 80,
    registeredCount: 64,
    contact: 'acm-chapter@campus.edu'
  },
  {
    id: 'beyond-the-algorithm',
    title: 'Beyond the Algorithm',
    subtitle: 'Guest Lecture: Designing Responsible AI with Dr. Mira Sen. Exploring safety, alignment, model evaluation, and societal consequences in modern LLMs.',
    handNote: 'Designing Responsible AI with Dr. Mira Sen.',
    category: 'GUEST LECTURE',
    subcategory: 'ACADEMIC',
    tag: 'DISTINGUISHED SPEAKER',
    paperColor: 'lilac',
    pinType: 'purple-pin',
    tapeType: 'none',
    rotation: -2.2,
    date: '31 March 2025',
    isoDate: '2025-03-31',
    startTime: '3:00 PM',
    endTime: '4:30 PM',
    venue: 'Hall 2, Ramanujan Block',
    regDeadline: 'Walk-ins welcome (Next Week)',
    urgency: 'distant',
    conflictNotice: null,
    prerequisites: ['No prior experience needed', 'Open seating', 'Q&A session with speaker'],
    capacity: 150,
    registeredCount: 92,
    contact: 'ethics-lab@campus.edu'
  },
  {
    id: 'build-your-portfolio',
    title: 'Build Your Portfolio',
    subtitle: 'Hands-on Web Studio: Turn your coursework, repos, and semester experiments into a single-page portfolio website deployed to production.',
    handNote: 'Turn your coursework into a single-page portfolio website.',
    category: 'HANDS-ON WORKSHOP',
    subcategory: 'CAREER & DEV',
    tag: 'BRING LAPTOP',
    paperColor: 'cream',
    pinType: 'wood-clip',
    tapeType: 'kraft-tape',
    rotation: 0.8,
    date: '1 April 2025',
    isoDate: '2025-04-01',
    startTime: '3:00 PM',
    endTime: '5:15 PM',
    venue: 'Design Studio, Ground Floor',
    regDeadline: '31 March 2025 · 6:00 PM',
    urgency: 'soon',
    conflictNotice: {
      level: 'caution',
      title: 'Tight transition window',
      description: 'Ends at 5:15 PM in Design Studio; Tiny Models talk begins at 5:30 PM in Block A (15 min transit).'
    },
    prerequisites: ['Laptop with modern browser', 'GitHub account ready', 'Bring 2-3 project screenshots or links'],
    capacity: 45,
    registeredCount: 39,
    contact: 'webcraft@campus.edu'
  },
  {
    id: 'tiny-models-big-ideas',
    title: 'Tiny Models, Big Ideas',
    subtitle: 'See how compact AI models can power fast, private experiences on everyday devices, followed by an open Q&A.',
    handNote: 'A friendly introduction to on-device intelligence.',
    category: 'TECH TALK',
    subcategory: 'AI & SYSTEMS',
    tag: 'OPEN SEATING',
    paperColor: 'white',
    pinType: 'red-pushpin',
    tapeType: 'none',
    rotation: -1.0,
    date: '1 April 2025',
    isoDate: '2025-04-01',
    startTime: '5:30 PM',
    endTime: '6:30 PM',
    venue: 'Auditorium, Block A',
    regDeadline: 'Walk-ins welcome (Next Week)',
    urgency: 'distant',
    conflictNotice: {
      level: 'caution',
      title: 'Deadlines are close together',
      description: 'The Portfolio Workshop ends shortly before this talk: allow 15 minutes to change buildings'
    },
    prerequisites: ['No prior experience needed', 'Open seating', 'Attendance certificate available'],
    capacity: 200,
    registeredCount: 142,
    contact: 'edgeai-club@campus.edu'
  },
  {
    id: 'team-trials',
    title: 'Team Trials',
    subtitle: 'Inter-collegiate varsity athletic selections across basketball, football, and badminton. Coaching staff evaluating fitness and drills.',
    handNote: 'Basketball, football and badminton selections.',
    category: 'CAMPUS SPORTS',
    subcategory: 'ATHLETICS',
    tag: 'TRYOUTS',
    paperColor: 'card',
    pinType: 'green-pushpin',
    tapeType: 'amber-tape',
    rotation: 2.1,
    date: '2 April 2025',
    isoDate: '2025-04-02',
    startTime: '4:00 PM',
    endTime: '7:00 PM',
    venue: 'Sports Complex & Courts',
    regDeadline: '1 April 2025 · 8:00 PM',
    conflictNotice: null,
    prerequisites: ['Sports shoes & athletic kit required', 'Medical self-clearance', 'Bring hydration bottle'],
    capacity: 120,
    registeredCount: 74,
    contact: 'athletics@campus.edu'
  },
  {
    id: 'rhythm-and-roots',
    title: 'Rhythm & Roots',
    subtitle: 'Annual Spring Cultural Fest: Two evenings of live acoustic music, traditional dance, street food stalls, and campus community vibes.',
    handNote: 'Two evenings of music, dance, food, and campus vibes.',
    category: 'CULTURAL FEST',
    subcategory: 'ARTS & MUSIC',
    tag: 'FESTIVAL',
    paperColor: 'pink',
    pinType: 'dual-pins',
    tapeType: 'pink-washi',
    rotation: 0.5,
    date: '4–5 April 2025',
    isoDate: '2025-04-04',
    startTime: '5:00 PM',
    endTime: '10:30 PM',
    venue: 'Main Amphitheatre & Lawn',
    regDeadline: 'Open to all students & alumni',
    conflictNotice: null,
    prerequisites: ['Valid student ID for gate entry', 'Complimentary entry wristband', 'Open lawn seating'],
    capacity: 1000,
    registeredCount: 680,
    contact: 'fest-council@campus.edu'
  },
  {
    id: 'coffee-brew-meetup',
    title: 'Coffee & Systems Chat',
    subtitle: 'Unstructured Friday discussion on Linux kernel modules, distributed systems, and favorite pour-over beans.',
    handNote: 'Friday 4 PM @ Student Lounge. Free pour-over coffee.',
    category: 'COMMUNITY',
    subcategory: 'CASUAL',
    tag: 'CASUAL',
    paperColor: 'kraft',
    pinType: 'yellow-pin',
    tapeType: 'none',
    rotation: -3.0,
    date: '28 March 2025',
    isoDate: '2025-03-28',
    startTime: '4:00 PM',
    endTime: '5:30 PM',
    venue: 'Student Lounge, Floor 2',
    regDeadline: 'Walk-ins welcome',
    conflictNotice: null,
    prerequisites: ['Bring your favorite mug', 'Casual participation'],
    capacity: 25,
    registeredCount: 19,
    contact: 'systems-club@campus.edu'
  }
];

// Registrations store
interface Registration {
  ticketId: string;
  noticeId: string;
  name: string;
  studentId: string;
  email: string;
  createdAt: string;
}

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
