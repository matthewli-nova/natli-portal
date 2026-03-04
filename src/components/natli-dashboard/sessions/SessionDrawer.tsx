import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';
import { getModelShortName } from '../../../lib/model-icons';

// ─── Types ───────────────────────────────────────────────────

interface EnrichedSession {
  key: string;
  updatedAt: number;
  ageMs: number;
  sessionId: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number | null;
  model: string;
  modelProvider: string;
  contextTokens: number;
  agentId: string;
  kind: string;
  sessionType: string;
  label: string;
  isActive: boolean;
  isRecent: boolean;
}

interface TranscriptMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasToolCalls: boolean;
}

interface SessionDrawerProps {
  session: EnrichedSession | null;
  onClose: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

function formatAge(ms: number): string {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ─── Component ───────────────────────────────────────────────

export function SessionDrawer({ session, onClose }: SessionDrawerProps) {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    setMessages([]);
    setLoading(true);

    fetch(`/api/sessions/${session.sessionId}/transcript?agentId=${session.agentId}&limit=20`)
      .then(r => r.json())
      .then(d => {
        setMessages(d.messages || []);
        setTotal(d.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.sessionId, session?.agentId]);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (session) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [session, onClose]);

  const isOpen = session !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-[520px] max-w-[90vw] z-50 flex flex-col bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {session && (
          <>
            {/* Header */}
            <div className="bg-[#022F44] text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-sm">Session Details</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-white/10 rounded transition-colors" title="Open externally">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Session meta card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#21262A] text-sm truncate">{session.key}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${session.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {session.isActive ? '● Active' : formatAge(session.ageMs)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <span>Agent: <strong className="text-gray-700">{session.agentId}</strong></span>
                  <span>Kind: <strong className="text-gray-700">{session.kind}</strong></span>
                  <span>Model: <strong className="text-gray-700">{getModelShortName(session.model)}</strong></span>
                  <span>Tokens: <strong className="text-gray-700">{formatTokens(session.totalTokens || 0)}</strong></span>
                </div>
              </div>

              {/* Transcript heading */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Transcript · last {messages.length} messages
                  {total > messages.length && <span className="ml-1 text-gray-300">of {total} total</span>}
                </h3>
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'gap-2'}`}>
                      {i % 2 !== 0 && <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse shrink-0" />}
                      <div className={`h-16 rounded-2xl bg-gray-200 animate-pulse ${i % 2 === 0 ? 'w-48' : 'w-64'}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && messages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-3xl mb-3">📭</p>
                  <p className="text-sm font-medium text-gray-600">No messages found</p>
                  <p className="text-xs text-gray-400 mt-1">This session may not have a stored transcript</p>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((msg) => (
                msg.role === 'user' ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] bg-[#023F59] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      {msg.timestamp && (
                        <p className="text-[10px] text-white/50 mt-1 text-right">{formatTime(msg.timestamp)}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex gap-2 items-start">
                    <img
                      src="/api/assets/nat-lee-avatar"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      alt="Nat Lee"
                    />
                    <div className="max-w-[85%]">
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-800">
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        {msg.hasToolCalls && (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-200 rounded-full px-2 py-0.5">🔧 Used tools</span>
                          </div>
                        )}
                      </div>
                      {msg.timestamp && (
                        <p className="text-[10px] text-gray-400 mt-1 ml-1">{formatTime(msg.timestamp)}</p>
                      )}
                    </div>
                  </div>
                )
              ))}

              <div ref={bottomRef} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SessionDrawer;
