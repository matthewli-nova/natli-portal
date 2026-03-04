import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';

// ─── Types ───────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
}

export interface QuickChatPanelProps {
  open: boolean;
  onClose: () => void;
  onActiveChange: (active: boolean) => void;
}

// ─── Quick Action Chips ──────────────────────────────────────

const QUICK_ACTIONS = [
  { label: '📊 System status', text: '📊 System status' },
  { label: '📋 Today\'s tasks', text: '📋 Today\'s tasks' },
  { label: '🔍 Latest session', text: '🔍 Latest session' },
];

// ─── Component ───────────────────────────────────────────────

export function QuickChatPanel({ open, onClose, onActiveChange }: QuickChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [open]);

  // Notify parent about active state
  useEffect(() => {
    onActiveChange(messages.length > 0);
  }, [messages.length, onActiveChange]);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      // Mark user message as sent
      setMessages(prev =>
        prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' as const } : m)
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || 'Message sent — Nat Lee is processing. Check Slack for the response.';

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
        status: 'sent',
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      // Mark user message as error
      setMessages(prev =>
        prev.map(m => m.id === userMsg.id ? { ...m, status: 'error' as const } : m)
      );

      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to send message'}`,
        timestamp: Date.now(),
        status: 'error',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-96 max-w-[calc(100vw-1rem)] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ─── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#022F44] text-white shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#31D7DB]" />
            <span className="font-semibold text-sm">Chat with Nat Lee</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* ─── Messages ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pb-8">
              <div className="w-14 h-14 rounded-full bg-[#31D7DB]/15 flex items-center justify-center">
                <Bot className="w-7 h-7 text-[#31D7DB]" />
              </div>
              <div>
                <p className="font-semibold text-[#21262A] text-sm">Chat with Nat Lee</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[260px]">
                  Ask anything about your AI operations, trigger tasks, or check status.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.text}
                    onClick={() => handleSend(action.text)}
                    className="px-3 py-1.5 text-xs rounded-full border border-[#023F59]/20 text-[#023F59] hover:bg-[#023F59]/5 hover:border-[#023F59]/40 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-[#31D7DB] text-sm pl-1">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ─── Input ──────────────────────────────────────── */}
        <div className="shrink-0 border-t border-[#023F59]/10 px-3 py-3 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Nat Lee…"
              rows={1}
              className="flex-1 resize-none rounded-lg border border-[#023F59]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#31D7DB] focus:border-transparent placeholder:text-muted-foreground"
              style={{ maxHeight: 120 }}
              disabled={loading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="h-9 w-9 p-0 shrink-0 rounded-lg bg-[#023F59] hover:bg-[#107DAC] text-white disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            Enter to send · Shift+Enter for newline
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Message Bubble ──────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'system') {
    return (
      <div className="text-center">
        <span className={`text-xs ${message.status === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>
          {message.content}
        </span>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className={`bg-[#023F59] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[85%] ${
          message.status === 'error' ? 'opacity-60 ring-1 ring-red-400' : ''
        }`}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {message.status === 'error' && (
            <p className="text-[10px] text-red-300 mt-1">Failed to send</p>
          )}
        </div>
      </div>
    );
  }

  // assistant
  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 rounded-full bg-[#31D7DB]/15 flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5 text-[#31D7DB]" />
      </div>
      <div className="bg-[#F5F7F9] text-[#21262A] rounded-2xl rounded-tl-sm px-3 py-2 text-sm max-w-[85%]">
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
