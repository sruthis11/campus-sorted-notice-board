export interface NoticeConflict {
  level: 'warning' | 'caution' | 'info';
  title: string;
  description: string;
}

export type PaperColor = 'yellow' | 'mint' | 'lilac' | 'cream' | 'white' | 'card' | 'pink' | 'kraft';
export type PinType = 'red-pushpin' | 'metal-paperclip' | 'purple-pin' | 'wood-clip' | 'green-pushpin' | 'dual-pins' | 'yellow-pin';
export type TapeType = 'pink-washi' | 'kraft-tape' | 'amber-tape' | 'none';

export interface ValidationFlag {
  field: string;
  status: 'verified' | 'missing' | 'unclear';
  note: string;
}

export interface ExtractedNoticeData {
  title: string;
  description: string;
  category: string;
  organizer: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  registrationDeadline: string;
  eligibility: string;
  registrationLink: string;
  contactInformation: string;
  instructions: string;
  summary: string;
  fullNotice: string;
  validationFlags?: ValidationFlag[];
  confidenceScore?: number;
}

export interface Notice {
  id: string;
  title: string;
  subtitle: string;
  handNote: string;
  category: string;
  subcategory: string;
  tag?: string;
  paperColor: PaperColor;
  pinType: PinType;
  tapeType?: TapeType;
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

  // Intelligent Automation fields
  organizer?: string;
  registrationLink?: string;
  instructions?: string;
  summary?: string;
  fullNotice?: string;
  posterImageData?: string;
  validationFlags?: ValidationFlag[];
  isAutoExtracted?: boolean;
}

export interface Registration {
  ticketId: string;
  noticeId: string;
  name: string;
  studentId: string;
  email: string;
  createdAt: string;
}

export interface AgentSourceReference {
  id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  regDeadline: string;
}

export interface AgentDirectAction {
  type: 'view' | 'register' | 'calendar';
  noticeId: string;
  label: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AgentSourceReference[];
  followUpQuestions?: string[];
  directAction?: AgentDirectAction;
  timestamp: string;
}
