export interface NoticeConflict {
  level: 'warning' | 'caution' | 'info';
  title: string;
  description: string;
}

export type PaperColor = 'yellow' | 'mint' | 'lilac' | 'cream' | 'white' | 'card' | 'pink' | 'kraft';
export type PinType = 'red-pushpin' | 'metal-paperclip' | 'purple-pin' | 'wood-clip' | 'green-pushpin' | 'dual-pins' | 'yellow-pin';
export type TapeType = 'pink-washi' | 'kraft-tape' | 'amber-tape' | 'none';

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
}

export interface Registration {
  ticketId: string;
  noticeId: string;
  name: string;
  studentId: string;
  email: string;
  createdAt: string;
}
