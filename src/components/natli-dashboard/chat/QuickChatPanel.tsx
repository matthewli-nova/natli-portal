import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Paperclip, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../../ui/button';

// ─── Types ───────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  isTyping?: boolean;
}

interface UploadedFile {
  file: File;
  name: string;
}

export interface QuickChatPanelProps {
  open: boolean;
  onClose: () => void;
  activeTab: string;
}

// ─── Constants ───────────────────────────────────────────────

const NAT_LEE_AVATAR = '/api/assets/nat-lee-avatar';

const TAB_LABELS: Record<string, string> = {
  overview: 'Overview',
  system: 'System',
  model: 'Models',
  session: 'Sessions',
  memory: 'Memory',
  schedule: 'Schedule',
  skills: 'Skills',
};

const SUGGESTIONS: Record<string, string[]> = {
  overview: ['\u{1F4CA} Give me a system health summary', '\u{1F50D} Any alerts I should know about?', '\u{1F4A1} What should I focus on today?'],
  system: ['\u{1F5A5} Is the system running smoothly?', '\u26A1 What\u2019s consuming the most CPU?', '\u{1F527} Any services down?'],
  model: ['\u{1F4B0} What\u2019s my token spend this week?', '\u{1F916} Which model is performing best?', '\u{1F4C8} Show me usage trends'],
  session: ['\u{1F504} What are the active sessions right now?', '\u{1F4DD} Summarize the last session', '\u{1F6A8} Any sessions with errors?'],
  memory: ['\u{1F9E0} Summarize what\u2019s in MEMORY.md', '\u{1F4DA} Run the memory janitor', '\u{1F50D} Search memory for vbiz'],
  schedule: ['\u23F0 What cron jobs run today?', '\u25B6\uFE0F Run the morning briefing now', '\u274C Any failed jobs recently?'],
  skills: ['\u{1F6E0} List all active skills', '\u{1F4E6} Any skills need updating?', '\u2795 What new skills should I add?'],
};

const DEFAULT_SUGGESTIONS = ['\u{1F4CA} System status summary', '\u{1F4CB} What tasks need attention?', '\u{1F50D} Show latest session activity'];

// ─── Component ───────────────────────────────────────────────

export function QuickChatPanel({ open, onClose, activeTab }: QuickChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const suggestions = SUGGESTIONS[activeTab] || DEFAULT_SUGGESTIONS;
  const tabLabel = TAB_LABELS[activeTab] || 'your dashboard';

  // Animate in on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
    }
  }, [open]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  const typewriterEffect = useCallback((fullText: string, messageId: string) => {
    const words = fullText.split(' ');
    let i = 0;
    setIsTyping(true);
    
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    typingIntervalRef.current = setInterval(() => {
      if (i >= words.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
        setMessages(prev => prev.map(m =>
          m.id === messageId ? { ...m, isTyping: false } : m
        ));
        return;
      }
      setMessages(prev => prev.map(m =>
        m.id === messageId
          ? { ...m, content: words.slice(0, i + 1).join(' ') }
          : m
      ));
      i++;
    }, 40);
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = (text ?? input).trim();
    if ((!messageText && !selectedFile) || loading || isTyping) return;

    let finalMessage = messageText;
    let fileChipText = '';

    // Handle file upload
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile.file);

        const uploadRes = await fetch('/api/chat/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          fileChipText = `[File: ${uploadData.filename}]\n\n${(uploadData.extractedText || '').slice(0, 4000)}`;
          finalMessage = fileChipText + (messageText ? `\n\n${messageText}` : '\n\nPlease review this file.');
        } else {
          fileChipText = `[File upload failed: ${selectedFile.name}]`;
          finalMessage = fileChipText + (messageText ? `\n\n${messageText}` : '');
        }
      } catch {
        fileChipText = `[File upload failed: ${selectedFile.name}]`;
        finalMessage = fileChipText + (messageText ? `\n\n${messageText}` : '');
      }
    }

    if (!finalMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText || `\u{1F4CE} ${selectedFile?.name}`,
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: finalMessage }),
        signal: AbortSignal.timeout(120000),
      });

      setMessages(prev =>
        prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' as const } : m)
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || 'Message sent \u2014 Nat Lee is processing.';

      const assistantMsgId = crypto.randomUUID();
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'sent',
        isTyping: true,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setLoading(false);

      // Start typewriter
      typewriterEffect(reply, assistantMsgId);
    } catch (err) {
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
      setLoading(false);
    }
  }, [input, loading, isTyping, selectedFile, typewriterEffect]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({ file, name: file.name });
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  if (!open) return null;

  const hasMessages = messages.length > 0;

  return (
    <div
      className={`fixed z-50 flex flex-col bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-out ${
        expanded
          ? 'bottom-4 right-4 w-[560px] h-[780px]'
          : 'bottom-4 right-4 w-[420px] h-[600px]'
      } ${
        animateIn
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-4'
      }`}
      style={{ transformOrigin: 'bottom right' }}
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB] shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src={NAT_LEE_AVATAR}
            alt="Nat Lee"
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="font-semibold text-sm text-gray-900">Chat with Nat Lee</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(e => !e)}
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ─── Messages Area ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Welcome state */}
        {!hasMessages && (
          <div className="flex flex-col items-center pt-6 pb-4 space-y-3">
            <img
              src={NAT_LEE_AVATAR}
              alt="Nat Lee"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-sm">
                How can I help you with {tabLabel}?
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-[300px]">
                I have full context about your AI operations and can assist.
              </p>
            </div>

            <div className="w-full border-t border-gray-100 my-2" />

            <div className="flex flex-col gap-2 w-full px-2">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2 text-sm text-left transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation messages */}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Thinking indicator */}
        {loading && (
          <div className="flex items-start gap-2">
            <img
              src={NAT_LEE_AVATAR}
              alt="Nat Lee"
              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
            />
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2">
              <span className="flex gap-1 text-[#31D7DB]">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>{'\u25CF'}</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>{'\u25CF'}</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>{'\u25CF'}</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input ──────────────────────────────────────── */}
      <div className="shrink-0 border-t border-[#E5E7EB] px-3 py-3 bg-white">
        {/* File chip */}
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2">
            <span className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2">
              {'\u{1F4C4}'} {selectedFile.name}
              <button
                onClick={() => setSelectedFile(null)}
                className="text-blue-400 hover:text-blue-600 font-bold"
              >
                {'\u00D7'}
              </button>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.heic"
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 shrink-0"
            disabled={loading || isTyping}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter message..."
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#31D7DB] focus:border-transparent placeholder:text-gray-400"
            disabled={loading || isTyping}
          />

          <Button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedFile) || loading || isTyping}
            className="h-9 w-9 p-0 shrink-0 rounded-full bg-[#023F59] hover:bg-[#107DAC] text-white disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'system') {
    return (
      <div className="text-center">
        <span className={`text-xs ${message.status === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
          {message.content}
        </span>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className={`bg-[#023F59] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm max-w-[80%] ${
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
      <img
        src="/api/assets/nat-lee-avatar"
        alt="Nat Lee"
        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
      />
      <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm max-w-[80%]">
        <p className="whitespace-pre-wrap break-words">
          {message.content}
          {message.isTyping && <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-text-bottom" />}
        </p>
      </div>
    </div>
  );
}
