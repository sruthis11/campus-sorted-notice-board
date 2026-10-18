// Shared notice types and seed board data used by both the local Express dev server
// and the Netlify Function API.

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

export interface Registration {
  ticketId: string;
  noticeId: string;
  name: string;
  studentId: string;
  email: string;
  createdAt: string;
}

// Seed initial dataset (matching the video's board notices)
export const seedNotices: Notice[] = [
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
