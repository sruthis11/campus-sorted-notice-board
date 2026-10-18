import type { Config, Context } from "@netlify/functions";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { notices, registrations } from "../../db/schema.ts";
import { seedNotices, type Notice, type NoticeConflict, type Registration } from "../../shared/notices.ts";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: securityHeaders });

// Best-effort per-instance rate limiter for anti-abuse
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(key: string, limit: number, windowMs: number): number | null {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  if (entry.count >= limit) return entry.resetAt - now;
  entry.count++;
  return null;
}

// Input sanitization helper
function sanitizeString(str: any): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "") // remove HTML tags
    .trim()
    .slice(0, 1000); // length safeguard
}

// Seed the board with the initial notices the first time it is read
let seeded: Promise<void> | null = null;
function ensureSeeded() {
  seeded ??= (async () => {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(notices);
    if (count > 0) return;
    await db
      .insert(notices)
      .values(
        seedNotices.map(({ registeredCount, ...data }, i) => ({
          id: data.id,
          data,
          registeredCount,
          sortKey: -i,
        }))
      )
      .onConflictDoNothing();
  })().catch((err) => {
    seeded = null;
    throw err;
  });
  return seeded;
}

type NoticeRow = typeof notices.$inferSelect;
const toNotice = (row: NoticeRow): Notice => ({ ...row.data, registeredCount: row.registeredCount });

async function listNotices(): Promise<Notice[]> {
  const rows = await db.select().from(notices).orderBy(desc(notices.sortKey));
  return rows.map(toNotice);
}

async function findNotice(id: string): Promise<Notice | null> {
  const [row] = await db.select().from(notices).where(eq(notices.id, id));
  return row ? toNotice(row) : null;
}

const toRegistration = (row: typeof registrations.$inferSelect): Registration => ({
  ticketId: row.ticketId,
  noticeId: row.noticeId,
  name: row.name,
  studentId: row.studentId,
  email: row.email,
  createdAt: row.createdAt.toISOString(),
});

async function createNotice(body: any) {
  const {
    title, subtitle, handNote, category, subcategory, tag, paperColor, pinType, tapeType,
    date, isoDate, startTime, endTime, venue, regDeadline, prerequisites, capacity, contact,
  } = body ?? {};

  if (!title || !category || !date || !venue) {
    return json({ success: false, error: "Title, category, date, and venue are required." }, 400);
  }

  const cleanTitle = sanitizeString(title);
  const cleanSubtitle = sanitizeString(subtitle || cleanTitle);
  const cleanHandNote = sanitizeString(handNote || cleanSubtitle);
  const cleanCategory = sanitizeString(category).toUpperCase();
  const cleanSubcategory = sanitizeString(subcategory || "CAMPUS EVENT");
  const cleanVenue = sanitizeString(venue);
  const cleanDate = sanitizeString(date);
  const cleanContact = sanitizeString(contact || "campus-office@campus.edu");

  // Auto-compute random tactile rotation (-3.0 to +3.0 deg)
  const randomRotation = Number((Math.random() * 6 - 3).toFixed(1));

  let id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `notice-${Date.now()}`;
  if (await findNotice(id)) id = `${id}-${Date.now()}`;

  // Conflict detection engine check
  const effectiveIsoDate = isoDate || "2025-04-01";
  let computedConflict: NoticeConflict | null = null;
  const sameDayNotices = (await listNotices()).filter((n) => n.isoDate === effectiveIsoDate);
  if (sameDayNotices.length > 0) {
    const conflicting = sameDayNotices[0];
    computedConflict = {
      level: "caution",
      title: "Schedule overlap warning",
      description: `Another campus event (${conflicting.title}) takes place on the same date at ${conflicting.startTime}. Check building distances.`,
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
    paperColor: paperColor || "yellow",
    pinType: pinType || "red-pushpin",
    tapeType: tapeType || "none",
    rotation: randomRotation,
    date: cleanDate,
    isoDate: effectiveIsoDate,
    startTime: sanitizeString(startTime || "10:00 AM"),
    endTime: sanitizeString(endTime || "12:00 PM"),
    venue: cleanVenue,
    regDeadline: sanitizeString(regDeadline || "Walk-ins welcome"),
    conflictNotice: computedConflict,
    prerequisites:
      Array.isArray(prerequisites) && prerequisites.length > 0
        ? prerequisites.map((p: any) => sanitizeString(p))
        : ["Open to all students", "No prerequisites required"],
    capacity: Number(capacity) || 100,
    registeredCount: 0,
    contact: cleanContact,
  };

  const { registeredCount, ...data } = newNotice;
  await db.insert(notices).values({ id, data, registeredCount, sortKey: Date.now() });

  return json({ success: true, message: "Notice pinned successfully to the board!", notice: newNotice }, 201);
}

// Intelligent notice decoder (Takes raw flyer text/bullet points and extracts structured fields)
function decodeNotice(body: any) {
  const rawText = body?.rawText;
  if (!rawText || typeof rawText !== "string") {
    return json({ success: false, error: "Raw text is required to decode." }, 400);
  }

  const clean = sanitizeString(rawText);
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  const titleCandidate = lines[0] || "Decoded Campus Session";
  const subCandidate = lines[1] || "Parsed notice information extracted from notice board.";

  // Date heuristic
  const dateMatch =
    clean.match(/(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i) ||
    clean.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);
  const dateExtracted = dateMatch ? dateMatch[0] : "15 April 2025";

  // Venue heuristic
  const venueMatch = clean.match(/(?:at|venue|location|room|hall|lab|auditorium)[\s:]+([^\n,\.]+)/i);
  const venueExtracted = venueMatch ? venueMatch[1].trim() : "Seminar Hall 1";

  // Time heuristic
  const timeMatch = clean.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);
  const timeExtracted = timeMatch ? timeMatch[0] : "3:00 PM";

  return json({
    success: true,
    decoded: {
      title: titleCandidate,
      subtitle: subCandidate,
      handNote: subCandidate.slice(0, 70),
      category: "DECODED EVENT",
      subcategory: "ACADEMIC & CLUB",
      date: dateExtracted,
      isoDate: "2025-04-15",
      startTime: timeExtracted,
      endTime: "5:00 PM",
      venue: venueExtracted,
      regDeadline: "Walk-ins welcome",
      paperColor: "mint",
      pinType: "red-pushpin",
      tapeType: "kraft-tape",
      prerequisites: ["Valid student ID", "Open seating", "Notebook or laptop suggested"],
    },
  });
}

async function register(body: any) {
  const { noticeId, name, studentId, email } = body ?? {};

  if (!noticeId || !name || !email) {
    return json({ success: false, error: "Event ID, full name, and email are required." }, 400);
  }

  const notice = await findNotice(String(noticeId));
  if (!notice) {
    return json({ success: false, error: "Event not found." }, 404);
  }

  const cleanEmail = sanitizeString(email).toLowerCase();
  const cleanName = sanitizeString(name);
  const cleanStudentId = sanitizeString(studentId || "GEN-STU");

  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return json({ success: false, error: "Please provide a valid email address." }, 400);
  }

  // Check duplicate
  const [existing] = await db
    .select()
    .from(registrations)
    .where(and(eq(registrations.noticeId, notice.id), eq(registrations.email, cleanEmail)));
  if (existing) {
    return json({
      success: true,
      message: "You are already registered for this event.",
      registration: toRegistration(existing),
      notice,
    });
  }

  // Generate unique pass token
  const ticketId = `PASS-${notice.id.slice(0, 4).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const [reg] = await db
    .insert(registrations)
    .values({ ticketId, noticeId: notice.id, name: cleanName, studentId: cleanStudentId, email: cleanEmail })
    .returning();

  const [updated] = await db
    .update(notices)
    .set({
      registeredCount: sql`${notices.registeredCount} + 1`,
      data: sql`${notices.data} || '{"isRegistered": true}'::jsonb`,
    })
    .where(eq(notices.id, notice.id))
    .returning();

  return json(
    {
      success: true,
      message: "Registration confirmed! Event pass generated.",
      registration: toRegistration(reg),
      notice: toNotice(updated),
    },
    201
  );
}

// Generate RFC 5545 iCalendar .ics file download
async function calendarIcs(id: string) {
  const notice = await findNotice(id);
  if (!notice) {
    return new Response("Event not found", { status: 404, headers: securityHeaders });
  }

  const cleanIso = notice.isoDate ? notice.isoDate.replace(/-/g, "") : "20250401";
  const startStamp = `${cleanIso}T100000Z`;
  const endStamp = `${cleanIso}T120000Z`;
  const nowStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Campus Sorted//Interactive Notice Board//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${notice.id}-${Date.now()}@campussorted.internal`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${notice.title} (${notice.category})`,
    `DESCRIPTION:${notice.subtitle.replace(/\n/g, " ")}`,
    `LOCATION:${notice.venue}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(icsContent, {
    headers: {
      ...securityHeaders,
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${notice.id}.ics"`,
    },
  });
}

async function readBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const method = req.method;
  const ip = context.ip || "unknown";

  try {
    if (parts[0] === "health" && method === "GET") {
      return json({ status: "ok", timestamp: new Date().toISOString() });
    }

    await ensureSeeded();

    if (parts[0] === "notices") {
      if (parts.length === 1 && method === "GET") {
        const all = await listNotices();
        return json({ success: true, count: all.length, notices: all });
      }
      if (parts.length === 1 && method === "POST") {
        const retryAfterMs = isRateLimited(`notices:${ip}`, 20, 60000);
        if (retryAfterMs !== null) {
          return json({ error: "Too many requests. Please slow down.", retryAfterMs }, 429);
        }
        return await createNotice(await readBody(req));
      }
      if (parts.length === 2 && parts[1] === "decode" && method === "POST") {
        return decodeNotice(await readBody(req));
      }
      if (parts.length === 2 && method === "GET") {
        const notice = await findNotice(parts[1]);
        if (!notice) return json({ success: false, error: "Notice not found" }, 404);
        return json({ success: true, notice });
      }
    }

    if (parts[0] === "registrations" && parts.length === 1) {
      if (method === "GET") {
        const rows = await db.select().from(registrations).orderBy(registrations.createdAt);
        return json({ success: true, count: rows.length, registrations: rows.map(toRegistration) });
      }
      if (method === "POST") {
        const retryAfterMs = isRateLimited(`registrations:${ip}`, 15, 60000);
        if (retryAfterMs !== null) {
          return json({ error: "Too many requests. Please slow down.", retryAfterMs }, 429);
        }
        return await register(await readBody(req));
      }
    }

    if (parts[0] === "calendar" && parts[1] === "ics" && parts.length === 3 && method === "GET") {
      return await calendarIcs(parts[2]);
    }

    return json({ success: false, error: "Not found" }, 404);
  } catch (err: any) {
    console.error("API error:", err);
    return json({ success: false, error: "Internal server error" }, 500);
  }
};

export const config: Config = {
  path: "/api/*",
};
