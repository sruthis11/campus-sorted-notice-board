import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Search,
  Filter,
  Bookmark,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import { Notice, AgentChatMessage, AgentSourceReference, AgentDirectAction } from '../types';

interface AiNoticeAgentProps {
  notices: Notice[];
  onSelectNotice: (notice: Notice) => void;
  onOpenRegister: (notice: Notice) => void;
  onClose?: () => void;
  isFloating?: boolean;
}

export const AiNoticeAgent: React.FC<AiNoticeAgentProps> = ({
  notices,
  onSelectNotice,
  onOpenRegister,
  onClose,
  isFloating = false
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **AI Notice Decoder Agent**, grounded in the official college circulars and bulletin notices.\n\nI can answer questions regarding **upcoming deadlines**, **eligibility & prerequisites**, **venues & timings**, and **schedule conflicts**. Ask me anything, or pick one of the quick queries below!`,
      followUpQuestions: [
        'Which notices have deadlines today or tomorrow?',
        'Do I need prior experience for Tiny Models, Big Ideas?',
        'What are the eligibility requirements for Project Expo?',
        'Are there any schedule conflicts between events?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterUrgency, setFilterUrgency] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build history
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          history: historyPayload,
          filters: {
            category: filterCategory,
            urgency: filterUrgency
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to get answer from Notice Agent');
      }

      const agentMsg: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        followUpQuestions: data.followUpQuestions || [],
        directAction: data.directAction || undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err: any) {
      const errorMsg: AgentChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Agent Error:** ${err.message || 'Unable to query notices.'} Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleActionClick = (action: AgentDirectAction) => {
    const target = notices.find(n => n.id === action.noticeId);
    if (!target) return;

    if (action.type === 'register') {
      onOpenRegister(target);
    } else if (action.type === 'calendar') {
      window.location.href = `/api/calendar/ics/${target.id}`;
    } else {
      onSelectNotice(target);
    }
  };

  const handleSourceClick = (src: AgentSourceReference) => {
    const target = notices.find(n => n.id === src.id);
    if (target) {
      onSelectNotice(target);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'assistant',
        content: `Chat history reset. How can I assist you with the college notices today?`,
        followUpQuestions: [
          'Which events have deadlines tonight or tomorrow?',
          'What equipment is required for Build Your Portfolio?',
          'Show me all sports and trials'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Urgent notices count
  const urgentCount = notices.filter(n => n.urgency === 'urgent').length;

  return (
    <div
      className={`flex flex-col bg-[#1c1815] text-stone-100 rounded-2xl border border-amber-900/40 shadow-2xl overflow-hidden ${
        isFloating ? 'h-[620px] max-h-[85vh] w-full max-w-xl' : 'min-h-[700px] w-full max-w-5xl mx-auto my-6'
      }`}
    >
      {/* Agent Top Header Bar */}
      <div className="bg-[#241d18] px-5 py-3.5 border-b border-amber-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-bold shadow-md ring-1 ring-amber-300/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-amber-100 font-serif tracking-tight">
                AI Notice Decoder Agent
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Grounded on {notices.length} Notices</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Grounded in official college circulars · Zero hallucination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 text-stone-400 hover:text-amber-200 hover:bg-stone-800/60 rounded-lg transition-colors cursor-pointer"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 rounded-lg transition-colors cursor-pointer"
              title="Close Assistant"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Retrieval & Filter Strip */}
      <div className="bg-[#201914] px-4 py-2 border-b border-amber-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
        <Filter className="w-3.5 h-3.5 text-amber-400 mr-1 shrink-0" />
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mr-1">
          Context Filter:
        </span>

        <button
          type="button"
          onClick={() => { setFilterCategory('ALL'); setFilterUrgency(null); }}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            filterCategory === 'ALL' && !filterUrgency
              ? 'bg-amber-500 text-stone-950'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          All Notices ({notices.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterUrgency(filterUrgency === 'urgent' ? null : 'urgent');
            handleSendQuery('Show all notices that have deadlines due tonight or tomorrow');
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
            filterUrgency === 'urgent'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-300 hover:bg-rose-950/40 border border-rose-900/40'
          }`}
        >
          <span>💨 Urgent Deadlines ({urgentCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterCategory('WORKSHOP');
            handleSendQuery('What workshops are scheduled and what are their prerequisites?');
          }}
          className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-stone-300 hover:bg-stone-800 whitespace-nowrap cursor-pointer"
        >
          Workshops
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterCategory('TECH');
            handleSendQuery('What tech keynotes and coding competitions are happening?');
          }}
          className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-stone-300 hover:bg-stone-800 whitespace-nowrap cursor-pointer"
        >
          Tech & Coding
        </button>

        <button
          type="button"
          onClick={() => handleSendQuery('Are there any schedule conflicts detected between events?')}
          className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-300 hover:bg-amber-950/40 border border-amber-800/40 whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Conflict Radar</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#171311]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Badge */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-stone-400 font-medium">
              {msg.role === 'user' ? (
                <>
                  <span>You</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-200 font-semibold">Campus Decoder Agent</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Bubble Content */}
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-md ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-xs'
                  : 'bg-[#251f1a] text-stone-200 border border-amber-900/30 rounded-tl-xs'
              }`}
            >
              {/* Message text with basic markdown formatting */}
              <div className="space-y-2 whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {/* Direct Action Callout (if recommended by agent) */}
              {msg.directAction && (
                <div className="mt-4 pt-3 border-t border-amber-950/40 flex items-center justify-between gap-3 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  <span className="text-xs font-semibold text-amber-200">
                    Recommended Action:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleActionClick(msg.directAction!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <span>{msg.directAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Grounded Source References */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-700/60">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-400/90 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Source Notices ({msg.sources.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.sources.map(src => (
                      <div
                        key={src.id}
                        className="p-2.5 rounded-xl bg-stone-900/80 border border-amber-900/40 hover:border-amber-500/60 transition-all flex flex-col justify-between text-left group"
                      >
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400/80 block">
                            {src.category}
                          </span>
                          <h4 className="font-serif font-bold text-xs text-stone-100 group-hover:text-amber-200 transition-colors line-clamp-1">
                            {src.title}
                          </h4>
                          <div className="mt-1 text-[10px] text-stone-400 space-y-0.5">
                            <div className="flex items-center gap-1 truncate">
                              <Calendar className="w-2.5 h-2.5 text-stone-500 shrink-0" />
                              <span>{src.date}</span>
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <MapPin className="w-2.5 h-2.5 text-stone-500 shrink-0" />
                              <span>{src.venue}</span>
                            </div>
                            <div className="flex items-center gap-1 truncate text-amber-300 font-medium">
                              <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              <span>Deadline: {src.regDeadline}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleSourceClick(src)}
                            className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Inspect on Board</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          <a
                            href={`/api/calendar/ics/${src.id}`}
                            className="text-[10px] text-stone-400 hover:text-stone-200 underline"
                            title="Download .ics"
                          >
                            .ics
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up question suggestion chips */}
              {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                    Suggested Follow-ups:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.followUpQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleSendQuery(q)}
                        className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-amber-950/60 hover:text-amber-200 hover:border-amber-700/60 border border-stone-700 text-[11px] text-stone-300 font-medium transition-all text-left cursor-pointer flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#251f1a] border border-amber-900/30 text-xs text-amber-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Retrieving verified notice context & generating answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Bar */}
      <div className="p-3 sm:p-4 bg-[#201914] border-t border-amber-900/40 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask about deadlines, eligibility, venue, rules, or schedule conflicts..."
              className="w-full px-4 py-2.5 rounded-xl bg-stone-900/90 border border-amber-900/50 text-stone-100 placeholder:text-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed active:scale-95"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 px-1">
          <span>Grounded on actual campus bulletin circulars</span>
          <span>Zero hallucination policy enforced</span>
        </div>
      </div>
    </div>
  );
};
