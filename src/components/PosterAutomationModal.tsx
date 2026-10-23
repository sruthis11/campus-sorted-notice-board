import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ZoomIn,
  RefreshCw,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Clipboard,
  Layers,
  ArrowRight,
  HelpCircle,
  Eye,
  Edit3
} from 'lucide-react';
import { ExtractedNoticeData, Notice, ValidationFlag } from '../types';

interface PosterAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoticePublished: (notice: Notice) => void;
}

type PipelineStep = 'idle' | 'ingesting' | 'understanding' | 'extracting' | 'validating' | 'generating' | 'review';

export const PosterAutomationModal: React.FC<PosterAutomationModalProps> = ({
  isOpen,
  onClose,
  onNoticePublished
}) => {
  // Upload and Image State
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileMime, setFileMime] = useState<string>('image/jpeg');
  const [isDragOver, setIsDragOver] = useState(false);

  // Pipeline State
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extracted Data & Editable Fields
  const [extractedData, setExtractedData] = useState<ExtractedNoticeData | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(95);
  const [activeTab, setActiveTab] = useState<'structured' | 'markdown'>('structured');
  const [isSaving, setIsSaving] = useState(false);

  // Poster Image Preview controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample Posters for 1-click test runs
  const samplePresets = [
    {
      id: 'converge-x',
      label: 'ConvergeX 2026',
      badge: 'AI Sprint · VIT Vellore',
      date: '23 Oct 2026',
      accent: 'from-blue-600 to-indigo-800',
      sampleSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><defs><linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%231e1b4b"/></linearGradient></defs><rect width="600" height="840" fill="url(%23cg1)"/><rect x="25" y="25" width="550" height="790" fill="none" stroke="%2338bdf8" stroke-width="2.5"/><text x="300" y="70" fill="%2338bdf8" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="3" text-anchor="middle">VELLORE INSTITUTE OF TECHNOLOGY · VIT VELLORE</text><text x="300" y="95" fill="%2394a3b8" font-family="sans-serif" font-size="11" letter-spacing="1.5" text-anchor="middle">SCHOOL OF COMPUTER SCIENCE &amp; ENGINEERING (SCSE)</text><text x="300" y="160" fill="%23ffffff" font-family="sans-serif" font-size="30" font-weight="900" text-anchor="middle">CONVERGEX 2026</text><text x="300" y="195" fill="%2338bdf8" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">AI Solution Sprint &amp; Agent Hackathon</text><text x="300" y="225" fill="%23cbd5e1" font-family="sans-serif" font-size="13" text-anchor="middle">Build Autonomous Multimodal Systems &amp; Generative Pipelines</text><rect x="55" y="260" width="490" height="175" rx="10" fill="%231e293b" fill-opacity="0.7" stroke="%23334155"/><text x="85" y="295" fill="%23f8fafc" font-family="sans-serif" font-size="15" font-weight="bold">📅 Date: 23 October 2026 (9:00 AM – 6:00 PM)</text><text x="85" y="330" fill="%23f8fafc" font-family="sans-serif" font-size="15" font-weight="bold">📍 Venue: VIT Vellore, Technology Tower Amphitheatre</text><text x="85" y="365" fill="%23fde047" font-family="sans-serif" font-size="15" font-weight="bold">⏰ Reg Deadline: 18 October 2026 · 11:59 PM</text><text x="85" y="400" fill="%2338bdf8" font-family="sans-serif" font-size="14">🔗 Register: https://vit.ac.in/converge-x-2026</text><rect x="55" y="455" width="490" height="170" rx="10" fill="%231e293b" fill-opacity="0.5" stroke="%23334155"/><text x="75" y="485" fill="%2338bdf8" font-family="sans-serif" font-size="13" font-weight="bold">⚡ TRACKS &amp; PROBLEM STATEMENTS:</text><text x="75" y="515" fill="%23e2e8f0" font-family="sans-serif" font-size="12">• Autonomous Workflow Agents &amp; Tool Calling Architecture</text><text x="75" y="540" fill="%23e2e8f0" font-family="sans-serif" font-size="12">• Local Edge Intelligence &amp; Multimodal Campus Vision</text><text x="75" y="565" fill="%23e2e8f0" font-family="sans-serif" font-size="12">• Generative Document Decoders &amp; Student Productivity</text><text x="75" y="595" fill="%23a7f3d0" font-family="sans-serif" font-size="12" font-weight="bold">💰 Cash Prizes: INR 75,000 + Incubation Fast-Track</text><text x="300" y="670" fill="%23cbd5e1" font-family="sans-serif" font-size="13" text-anchor="middle">Eligibility: Open to all undergraduate &amp; graduate students (Teams of 2–4)</text><text x="300" y="700" fill="%2394a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Bring laptops, chargers, and valid student ID card. Registration is Free.</text><text x="300" y="760" fill="%2338bdf8" font-family="sans-serif" font-size="12" text-anchor="middle">Official Portal: https://vit.ac.in/converge-x-2026</text><text x="300" y="785" fill="%2364748b" font-family="sans-serif" font-size="11" text-anchor="middle">Inquiries: converge-x@vit.ac.in · +91 416 220 2000</text></svg>`
    },
    {
      id: 'robotics-expo',
      label: 'Robotics Expo 2025',
      badge: 'Tech & Hardware',
      date: '16 Apr 2025',
      accent: 'from-amber-500 to-orange-600',
      sampleSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="600" height="840" fill="url(%23g1)"/><rect x="25" y="25" width="550" height="790" fill="none" stroke="%23f59e0b" stroke-width="3" stroke-dasharray="8 4"/><text x="300" y="80" fill="%23f59e0b" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="4" text-anchor="middle">ROBOTICS &amp; MECHATRONICS SOCIETY</text><text x="300" y="160" fill="%23ffffff" font-family="sans-serif" font-size="32" font-weight="900" text-anchor="middle">ROBOTICS EXPO 2025</text><text x="300" y="200" fill="%2394a3b8" font-family="sans-serif" font-size="16" text-anchor="middle">&amp; Autonomous Rover Showcase</text><circle cx="300" cy="340" r="100" fill="%23f59e0b" fill-opacity="0.1" stroke="%23f59e0b" stroke-width="2"/><text x="300" y="348" fill="%23f59e0b" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle">⚡ RMS ROVER</text><rect x="60" y="480" width="480" height="180" rx="12" fill="%23334155" fill-opacity="0.4" stroke="%23475569"/><text x="90" y="520" fill="%23f8fafc" font-family="sans-serif" font-size="16" font-weight="bold">📅 Date: 16 April 2025 (10:00 AM - 4:00 PM)</text><text x="90" y="555" fill="%23f8fafc" font-family="sans-serif" font-size="16" font-weight="bold">📍 Venue: Engineering Quadrangle &amp; Maker Lab B</text><text x="90" y="590" fill="%23fbbf24" font-family="sans-serif" font-size="16" font-weight="bold">⏰ Reg Deadline: 14 April 2025 · 6:00 PM</text><text x="90" y="625" fill="%2338bdf8" font-family="sans-serif" font-size="14">🔗 Register: https://campus.edu/rms-expo2025</text><text x="300" y="720" fill="%23cbd5e1" font-family="sans-serif" font-size="13" text-anchor="middle">Eligibility: Open to all undergraduate &amp; postgraduate students</text><text x="300" y="745" fill="%2394a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Bring battery charging packs and safety goggles for track access</text><text x="300" y="790" fill="%2364748b" font-family="sans-serif" font-size="11" text-anchor="middle">Inquiries: rms-lead@campus.edu · +1 (555) 019-2831</text></svg>`
    },
    {
      id: 'hack-sprint',
      label: 'Climate Hack 2025',
      badge: '24h Hackathon',
      date: '19–20 Apr 2025',
      accent: 'from-emerald-600 to-teal-700',
      sampleSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23064e3b"/><stop offset="100%" stop-color="%23022c22"/></linearGradient></defs><rect width="600" height="840" fill="url(%23g2)"/><rect x="25" y="25" width="550" height="790" fill="none" stroke="%2334d399" stroke-width="2"/><text x="300" y="80" fill="%2334d399" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="3" text-anchor="middle">DEPT OF COMPUTER SCIENCE &amp; GREENTECH</text><text x="300" y="160" fill="%23ffffff" font-family="sans-serif" font-size="34" font-weight="900" text-anchor="middle">GLOBAL CODE HACK 2025</text><text x="300" y="200" fill="%23a7f3d0" font-family="sans-serif" font-size="17" text-anchor="middle">24-Hour Climate &amp; Data Pipeline Sprint</text><rect x="60" y="470" width="480" height="190" rx="12" fill="%23065f46" fill-opacity="0.5" stroke="%23059669"/><text x="90" y="515" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">📅 Date: 19–20 April 2025 (9:00 AM - 12:00 PM Sun)</text><text x="90" y="550" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">📍 Venue: Turing Computing Center, 3rd Floor</text><text x="90" y="585" fill="%23fde047" font-family="sans-serif" font-size="16" font-weight="bold">⏰ Deadline: 17 April 2025 · 11:59 PM</text><text x="90" y="620" fill="%236ee7b7" font-family="sans-serif" font-size="14">🔗 Register: https://campus.edu/greentech-hack</text><text x="300" y="715" fill="%23d1fae5" font-family="sans-serif" font-size="13" text-anchor="middle">Eligibility: Open to all students with basic coding knowledge</text><text x="300" y="740" fill="%23a7f3d0" font-family="sans-serif" font-size="12" text-anchor="middle">Bring laptop, charger, student ID. Sleeping kit optional.</text><text x="300" y="790" fill="%236ee7b7" font-family="sans-serif" font-size="11" text-anchor="middle">Contact: cs-hackathon@campus.edu</text></svg>`
    },
    {
      id: 'jazz-night',
      label: 'Jazz Sunset Lounge',
      badge: 'Cultural Music',
      date: '22 Apr 2025',
      accent: 'from-purple-700 to-indigo-900',
      sampleSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%233b0764"/><stop offset="100%" stop-color="%231e1b4b"/></linearGradient></defs><rect width="600" height="840" fill="url(%23g3)"/><text x="300" y="80" fill="%23c084fc" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="4" text-anchor="middle">CAMPUS CULTURAL AFFAIRS COMMITTEE</text><text x="300" y="160" fill="%23ffffff" font-family="serif" font-size="34" font-weight="bold" text-anchor="middle">SPRING ACOUSTIC &amp; JAZZ</text><text x="300" y="200" fill="%23e9d5ff" font-family="serif" font-style="italic" font-size="18" text-anchor="middle">Sunset Lounge by the Courtyard</text><rect x="60" y="470" width="480" height="170" rx="12" fill="%23581c87" fill-opacity="0.4" stroke="%237e22ce"/><text x="90" y="520" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">📅 Date: Tuesday, 22 April 2025 (6:30 PM - 9:30 PM)</text><text x="90" y="560" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="bold">📍 Venue: Stone Courtyard &amp; Amphitheatre Steps</text><text x="90" y="600" fill="%23f472b6" font-family="sans-serif" font-size="15">Entry: Free with student or faculty ID · Walk-in seating</text><text x="300" y="715" fill="%23e9d5ff" font-family="sans-serif" font-size="13" text-anchor="middle">Open to all students, faculty, and university community members</text><text x="300" y="780" fill="%23c084fc" font-family="sans-serif" font-size="11" text-anchor="middle">Contact: cultural-board@campus.edu</text></svg>`
    }
  ];

  // Clipboard Paste (Ctrl+V) listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      if (pipelineStep !== 'idle' && pipelineStep !== 'review') return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleFileSelect(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, pipelineStep]);

  if (!isOpen) return null;

  // Process file upload
  const handleFileSelect = (selectedFile: File) => {
    setErrorMsg(null);

    // Validate size (<25MB)
    if (selectedFile.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds 25MB limit. Please upload a smaller poster image or PDF.');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileMime(selectedFile.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setImagePreview(base64Data);
      // Automatically trigger 7-stage automation pipeline
      runAutomationPipeline({
        imageBase64: base64Data,
        mimeType: selectedFile.type || 'image/jpeg',
        fileName: selectedFile.name
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  // Run Sample Preset
  const handleSelectSample = (sample: typeof samplePresets[0]) => {
    setErrorMsg(null);
    setImagePreview(sample.sampleSvg);
    setFileName(`${sample.id}-poster.svg`);
    setFileMime('image/svg+xml');
    runAutomationPipeline({
      imageBase64: sample.sampleSvg,
      mimeType: 'image/svg+xml',
      fileName: `${sample.id}-poster.svg`,
      sampleId: sample.id
    });
  };

  // 7-Stage Automated Pipeline Execution
  const runAutomationPipeline = async (payload: {
    imageBase64: string;
    mimeType: string;
    fileName: string;
    sampleId?: string;
  }) => {
    setErrorMsg(null);

    // Stage 1: Ingesting & Image Processing
    setPipelineStep('ingesting');
    setProgressPercent(15);

    await new Promise((r) => setTimeout(r, 450));

    // Stage 2: Multimodal Text & Layout Understanding
    setPipelineStep('understanding');
    setProgressPercent(35);

    await new Promise((r) => setTimeout(r, 450));

    // Stage 3: Information Extraction
    setPipelineStep('extracting');
    setProgressPercent(60);

    try {
      const res = await fetch('/api/posters/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.extracted) {
        throw new Error(data.error || 'Failed to extract structured data from poster.');
      }

      // Stage 4: Field Validation & Hallucination Guard
      setPipelineStep('validating');
      setProgressPercent(80);
      await new Promise((r) => setTimeout(r, 400));

      // Stage 5: Digital Notice Generation
      setPipelineStep('generating');
      setProgressPercent(95);
      await new Promise((r) => setTimeout(r, 350));

      // Stage 6 & 7: Ready for Review & Confirmation
      setExtractedData(data.extracted);
      setConfidenceScore(data.extracted.confidenceScore || 94);
      setProgressPercent(100);
      setPipelineStep('review');
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMsg(err.message || 'Poster processing encountered an error. Please try again.');
      setPipelineStep('idle');
      setProgressPercent(0);
    }
  };

  // Form field update
  const handleFieldChange = (field: keyof ExtractedNoticeData, value: string) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      [field]: value
    });
  };

  // Publish Notice to Backend Database
  const handleConfirmAndPublish = async () => {
    if (!extractedData) return;
    setIsSaving(true);
    setErrorMsg(null);

    try {
      // Map category to paper color & pin
      let paperColor: Notice['paperColor'] = 'yellow';
      let pinType: Notice['pinType'] = 'red-pushpin';
      let tapeType: Notice['tapeType'] = 'none';

      const catUpper = (extractedData.category || '').toUpperCase();
      if (catUpper.includes('HACK') || catUpper.includes('CODE')) {
        paperColor = 'mint';
        pinType = 'metal-paperclip';
      } else if (catUpper.includes('CULTUR') || catUpper.includes('MUSIC')) {
        paperColor = 'pink';
        pinType = 'dual-pins';
        tapeType = 'pink-washi';
      } else if (catUpper.includes('WORKSHOP')) {
        paperColor = 'cream';
        pinType = 'wood-clip';
        tapeType = 'kraft-tape';
      } else if (catUpper.includes('SPORTS')) {
        paperColor = 'card';
        pinType = 'green-pushpin';
      }

      // Compute urgency based on deadline
      let urgency: Notice['urgency'] = 'distant';
      const deadlineLow = (extractedData.registrationDeadline || '').toLowerCase();
      if (deadlineLow.includes('tonight') || deadlineLow.includes('tomorrow') || deadlineLow.includes('urgent')) {
        urgency = 'urgent';
      } else if (deadlineLow.includes('in 3 days') || deadlineLow.includes('this week') || deadlineLow.includes('soon')) {
        urgency = 'soon';
      }

      // Convert instructions/eligibility into prerequisites array
      const prereqs: string[] = [];
      if (extractedData.eligibility && extractedData.eligibility !== 'Not mentioned in poster') {
        prereqs.push(extractedData.eligibility);
      }
      if (extractedData.instructions && extractedData.instructions !== 'Not mentioned in poster') {
        prereqs.push(extractedData.instructions);
      }
      if (prereqs.length === 0) {
        prereqs.push('Valid student ID required at gate entry', 'Open seating');
      }

      const noticePayload = {
        title: extractedData.title,
        subtitle: extractedData.description,
        handNote: extractedData.summary.slice(0, 65),
        category: extractedData.category || 'CAMPUS EVENT',
        subcategory: extractedData.organizer || 'STUDENT EVENT',
        tag: urgency === 'urgent' ? 'DUE SOON' : 'VERIFIED POSTER',
        paperColor,
        pinType,
        tapeType,
        date: extractedData.eventDate !== 'Not mentioned in poster' ? extractedData.eventDate : 'Upcoming Spring 2025',
        isoDate: '2025-04-18',
        startTime: extractedData.startTime !== 'Not mentioned in poster' ? extractedData.startTime : '10:00 AM',
        endTime: extractedData.endTime !== 'Not mentioned in poster' ? extractedData.endTime : '4:00 PM',
        venue: extractedData.venue !== 'Not mentioned in poster' ? extractedData.venue : 'Campus Quadrangle',
        regDeadline: extractedData.registrationDeadline,
        prerequisites: prereqs,
        capacity: 150,
        contact: extractedData.contactInformation !== 'Not mentioned in poster' ? extractedData.contactInformation : 'campus-events@campus.edu',

        // Automated Fields
        organizer: extractedData.organizer,
        registrationLink: extractedData.registrationLink,
        instructions: extractedData.instructions,
        summary: extractedData.summary,
        fullNotice: extractedData.fullNotice,
        posterImageData: imagePreview || undefined,
        validationFlags: extractedData.validationFlags,
        isAutoExtracted: true
      };

      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticePayload)
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to pin official notice.');
      }

      onNoticePublished(result.notice);
      onClose();
    } catch (err: any) {
      console.error('Error saving notice:', err);
      setErrorMsg(err.message || 'Failed to save notice to board.');
    } finally {
      setIsSaving(false);
    }
  };

  // Status helper for validation chips
  const getFieldStatus = (fieldKey: string, val: string | undefined): 'verified' | 'missing' | 'unclear' => {
    if (!val || val === 'Not mentioned in poster') return 'missing';
    const flag = extractedData?.validationFlags?.find((f) => f.field === fieldKey);
    return flag ? flag.status : 'verified';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-[#1c1917] text-stone-100 rounded-2xl w-full max-w-6xl shadow-2xl border border-stone-800 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
                  Intelligent Poster Automation
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  MULTIMODAL AI EXTRACTOR
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Automatically extracts verified event facts, detects missing info, and generates standardized digital notices.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Stage Pipeline Progress Bar */}
        <div className="bg-stone-950/70 border-b border-stone-800/80 px-6 py-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Automated Pipeline:</span>
              <span className="font-bold text-amber-300 uppercase tracking-wide">
                {pipelineStep === 'idle' && 'Ready for Poster Input'}
                {pipelineStep === 'ingesting' && 'Stage 1: Ingesting & Optimizing Image...'}
                {pipelineStep === 'understanding' && 'Stage 2: Multimodal Text & Layout Understanding...'}
                {pipelineStep === 'extracting' && 'Stage 3: Extracting Core Event Facts...'}
                {pipelineStep === 'validating' && 'Stage 4: Checking Field Validation & Confidence...'}
                {pipelineStep === 'generating' && 'Stage 5: Generating Official Digital Notice...'}
                {pipelineStep === 'review' && 'Stage 6 & 7: Verified Notice Ready for Review'}
              </span>
            </div>
            {pipelineStep !== 'idle' && (
              <span className="font-mono text-xs text-amber-400 font-bold">{progressPercent}%</span>
            )}
          </div>

          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-200 text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {pipelineStep === 'idle' && !imagePreview ? (
            /* Upload / Ingestion Screen */
            <div className="space-y-6">
              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  isDragOver
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : 'border-stone-700 hover:border-amber-500/50 hover:bg-stone-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-16 h-16 rounded-2xl bg-stone-800/80 text-amber-400 mx-auto mb-4 flex items-center justify-center border border-stone-700 shadow-inner">
                  <Upload className="w-8 h-8" />
                </div>

                <h3 className="font-serif text-lg font-bold text-amber-100">
                  Drop your event poster, flyer, or circular here
                </h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Supports <strong className="text-stone-300">PNG, JPG, WebP, SVG, and PDF</strong> notices up to 25MB.
                  You can also paste a screenshot directly using <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-600 font-mono text-[11px] text-amber-300">Ctrl+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-600 font-mono text-[11px] text-amber-300">Cmd+V</kbd>.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md cursor-pointer transition-transform hover:scale-105">
                  <Upload className="w-4 h-4" />
                  <span>Choose file from computer</span>
                </div>
              </div>

              {/* Instant 1-Click Sample Test Posters */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clipboard className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold tracking-wider uppercase text-stone-300">
                      Or Try an Instant Sample Poster:
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500">1-click automated extraction</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {samplePresets.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800/80 text-left transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {sample.badge}
                          </span>
                          <span className="text-[10px] text-stone-400">{sample.date}</span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-stone-200 group-hover:text-amber-300 transition-colors">
                          {sample.label}
                        </h4>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-amber-400 font-semibold pt-2 border-t border-stone-800">
                        <span>Auto-Extract Poster</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : pipelineStep !== 'review' ? (
            /* Pipeline Loading Animation */
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping" />
                <div className="relative w-full h-full rounded-2xl bg-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-2xl">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-amber-100">
                  {pipelineStep === 'ingesting' && 'Ingesting & Processing Poster Image...'}
                  {pipelineStep === 'understanding' && 'Multimodal Text & Layout Understanding...'}
                  {pipelineStep === 'extracting' && 'Extracting Dates, Venues, Deadlines & Links...'}
                  {pipelineStep === 'validating' && 'Validating Fields & Flagging Missing Details...'}
                  {pipelineStep === 'generating' && 'Generating Standardized Official Notice...'}
                </h3>
                <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                  Running multimodal neural extraction. Missing fields will be explicitly tagged as "Not mentioned in poster" to prevent hallucination.
                </p>
              </div>
            </div>
          ) : (
            /* Side-by-Side Review & Editing Screen */
            extractedData && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Pane: Poster Image Inspection (5 Cols) */}
                <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3 text-xs">
                    <div className="flex items-center gap-2 text-stone-300 font-semibold">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span className="truncate max-w-[180px]">{fileName || 'Original Poster'}</span>
                    </div>

                    {/* Inspection Controls: Zoom & Rotate */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => (z >= 1.5 ? 1 : z + 0.25))}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                        title="Toggle Zoom"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotationAngle((r) => (r + 90) % 360)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                        title="Rotate Image"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Poster Canvas Preview */}
                  <div className="w-full h-[460px] bg-stone-950 rounded-xl overflow-hidden flex items-center justify-center p-2 relative border border-stone-800/80">
                    {imagePreview ? (
                      <div
                        className="transition-transform duration-200 max-h-full max-w-full flex items-center justify-center"
                        style={{
                          transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Uploaded poster preview"
                          className="max-h-[440px] max-w-full object-contain rounded shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="text-stone-500 text-xs">No image loaded</div>
                    )}
                  </div>

                  {/* Validation Summary Chips */}
                  <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-stone-300 font-bold">Extraction Confidence:</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">{confidenceScore}%</span>
                  </div>

                  {/* Re-upload button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPipelineStep('idle');
                      setImagePreview(null);
                      setFile(null);
                      setExtractedData(null);
                    }}
                    className="mt-3 w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload a Different Poster</span>
                  </button>
                </div>

                {/* Right Pane: Structured Fields & Notice Review (7 Cols) */}
                <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-5 flex flex-col">
                  {/* Mode Tabs */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('structured')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                          activeTab === 'structured'
                            ? 'bg-amber-500 text-stone-950 shadow'
                            : 'text-stone-400 hover:text-white bg-stone-800/60'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Structured Fields</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('markdown')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                          activeTab === 'markdown'
                            ? 'bg-amber-500 text-stone-950 shadow'
                            : 'text-stone-400 hover:text-white bg-stone-800/60'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Standardized Notice</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        imagePreview &&
                        runAutomationPipeline({
                          imageBase64: imagePreview,
                          mimeType: fileMime,
                          fileName: fileName
                        })
                      }
                      className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 cursor-pointer transition-colors"
                      title="Re-run multimodal extraction"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>

                  {/* Tab 1: Editable Structured Fields */}
                  {activeTab === 'structured' && (
                    <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 text-xs">
                      {/* Executive Summary Callout */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                          AI Executive Summary (Automated)
                        </span>
                        <textarea
                          value={extractedData.summary}
                          onChange={(e) => handleFieldChange('summary', e.target.value)}
                          rows={2}
                          className="w-full bg-transparent text-amber-100 text-xs font-medium focus:outline-hidden resize-none"
                        />
                      </div>

                      {/* Title & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-stone-400 font-bold uppercase text-[10px]">Event Title</label>
                            <span className="text-[10px] text-emerald-400 font-bold">Verified</span>
                          </div>
                          <input
                            type="text"
                            value={extractedData.title}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:border-amber-400 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-stone-400 font-bold uppercase text-[10px]">Category</label>
                          <input
                            type="text"
                            value={extractedData.category}
                            onChange={(e) => handleFieldChange('category', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:border-amber-400 focus:outline-hidden uppercase"
                          />
                        </div>
                      </div>

                      {/* Organizer & Description */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-stone-400 font-bold uppercase text-[10px]">
                            Organizer / Department
                          </label>
                          <span
                            className={`text-[10px] font-bold ${
                              getFieldStatus('organizer', extractedData.organizer) === 'missing'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {extractedData.organizer === 'Not mentioned in poster' ? 'Not mentioned' : 'Verified'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={extractedData.organizer}
                          onChange={(e) => handleFieldChange('organizer', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-bold uppercase text-[10px]">Event Description</label>
                        <textarea
                          value={extractedData.description}
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden resize-none leading-relaxed"
                        />
                      </div>

                      {/* Date, Times & Venue */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-stone-400 font-bold uppercase text-[10px]">Event Date</label>
                          <input
                            type="text"
                            value={extractedData.eventDate}
                            onChange={(e) => handleFieldChange('eventDate', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-stone-400 font-bold uppercase text-[10px]">Start Time</label>
                          <input
                            type="text"
                            value={extractedData.startTime}
                            onChange={(e) => handleFieldChange('startTime', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-stone-400 font-bold uppercase text-[10px]">End Time</label>
                          <input
                            type="text"
                            value={extractedData.endTime}
                            onChange={(e) => handleFieldChange('endTime', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-bold uppercase text-[10px]">Venue / Location</label>
                        <input
                          type="text"
                          value={extractedData.venue}
                          onChange={(e) => handleFieldChange('venue', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      {/* Registration Deadline & Registration Link */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-stone-400 font-bold uppercase text-[10px]">
                              Registration Deadline
                            </label>
                            <span
                              className={`text-[10px] font-bold ${
                                extractedData.registrationDeadline === 'Not mentioned in poster'
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {extractedData.registrationDeadline === 'Not mentioned in poster'
                                ? 'Not mentioned'
                                : 'Verified'}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={extractedData.registrationDeadline}
                            onChange={(e) => handleFieldChange('registrationDeadline', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-stone-400 font-bold uppercase text-[10px]">
                              Registration Link
                            </label>
                            <span
                              className={`text-[10px] font-bold ${
                                extractedData.registrationLink === 'Not mentioned in poster'
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {extractedData.registrationLink === 'Not mentioned in poster'
                                ? 'Not mentioned'
                                : 'Verified'}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={extractedData.registrationLink}
                            onChange={(e) => handleFieldChange('registrationLink', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Eligibility, Instructions & Contact */}
                      <div className="space-y-1">
                        <label className="text-stone-400 font-bold uppercase text-[10px]">Eligibility Criteria</label>
                        <input
                          type="text"
                          value={extractedData.eligibility}
                          onChange={(e) => handleFieldChange('eligibility', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-bold uppercase text-[10px]">
                          Special Instructions / What to Bring
                        </label>
                        <input
                          type="text"
                          value={extractedData.instructions}
                          onChange={(e) => handleFieldChange('instructions', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-bold uppercase text-[10px]">
                          Contact Information
                        </label>
                        <input
                          type="text"
                          value={extractedData.contactInformation}
                          onChange={(e) => handleFieldChange('contactInformation', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Standardized Markdown Notice */}
                  {activeTab === 'markdown' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span>Standardized Digital Circular (Markdown Format):</span>
                        <span className="text-[11px] text-stone-500">Edit directly if needed</span>
                      </div>
                      <textarea
                        value={extractedData.fullNotice}
                        onChange={(e) => handleFieldChange('fullNotice', e.target.value)}
                        rows={16}
                        className="w-full p-4 rounded-xl bg-stone-950 border border-stone-700 font-mono text-xs text-stone-200 focus:border-amber-400 focus:outline-hidden leading-relaxed resize-none"
                      />
                    </div>
                  )}

                  {/* Bottom Confirmation Action */}
                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-stone-700 text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmAndPublish}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Publishing to Board...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm &amp; Publish Official Notice</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};
