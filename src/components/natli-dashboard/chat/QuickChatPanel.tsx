import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Plus,
  Maximize2,
  Minimize2,
  Sparkles,
  Code2,
  PenLine,
  BookOpen,
  Coffee,
  Wand2,
  ChevronDown,
} from 'lucide-react';
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
  // Populated after upload completes
  savedAs?: string;
  mimeType?: string;
  isImage?: boolean;
  extractedText?: string;
}

interface ModelOption {
  id: string;
  label: string;
  provider?: string;
}

export interface QuickChatPanelProps {
  open: boolean;
  onClose: () => void;
  activeTab: string;
}

// ─── Helpers ─────────────────────────────────────────────────

/** Safe UUID — crypto.randomUUID() requires secure context (HTTPS/localhost).
 *  Falls back to Math.random when accessed over a LAN IP on HTTP. */
function genId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

// ─── Constants ───────────────────────────────────────────────

const NAT_LEE_AVATAR = '/api/assets/nat-lee-avatar';

const DEFAULT_MODEL_OPTIONS: ModelOption[] = [
  { id: 'anthropic/claude-opus-4-6', label: 'Claude Opus 4.6', provider: 'openrouter' },
  { id: 'anthropic/claude-sonnet-4-6', label: 'Claude Sonnet 4.6', provider: 'openrouter' },
];

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.heic';
const ACCEPTED_MIME_RE =
  /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet))|application\/vnd\.ms-excel|text\/csv|image\/(png|jpe?g|heic))$/;

const TAB_LABELS: Record<string, string> = {
  overview: 'Overview',
  system: 'System',
  model: 'Models',
  session: 'Sessions',
  memory: 'Memory',
  schedule: 'Schedule',
  skills: 'Skills',
};

const SUGGESTIONS: Record<string, { icon: typeof Code2; label: string; prompt: string }[]> = {
  overview: [
    { icon: Sparkles, label: 'Health summary', prompt: 'Give me a system health summary' },
    { icon: Wand2, label: 'Alerts', prompt: 'Any alerts I should know about?' },
    { icon: Coffee, label: 'Focus today', prompt: 'What should I focus on today?' },
  ],
  system: [
    { icon: Code2, label: 'System status', prompt: 'Is the system running smoothly?' },
    { icon: Sparkles, label: 'CPU usage', prompt: "What is consuming the most CPU?" },
    { icon: Wand2, label: 'Services', prompt: 'Any services down?' },
  ],
  model: [
    { icon: Sparkles, label: 'Token spend', prompt: "What is my token spend this week?" },
    { icon: Code2, label: 'Best model', prompt: 'Which model is performing best?' },
    { icon: BookOpen, label: 'Usage trends', prompt: 'Show me usage trends' },
  ],
  session: [
    { icon: Sparkles, label: 'Active sessions', prompt: 'What are the active sessions right now?' },
    { icon: PenLine, label: 'Last session', prompt: 'Summarize the last session' },
    { icon: Wand2, label: 'Errors', prompt: 'Any sessions with errors?' },
  ],
  memory: [
    { icon: BookOpen, label: 'Memory summary', prompt: "Summarize what is in MEMORY.md" },
    { icon: Wand2, label: 'Run janitor', prompt: 'Run the memory janitor' },
    { icon: Code2, label: 'Search memory', prompt: 'Search memory for vbiz' },
  ],
  schedule: [
    { icon: Sparkles, label: "Today's jobs", prompt: 'What cron jobs run today?' },
    { icon: Wand2, label: 'Morning brief', prompt: 'Run the morning briefing now' },
    { icon: Coffee, label: 'Failed jobs', prompt: 'Any failed jobs recently?' },
  ],
  skills: [
    { icon: Code2, label: 'Active skills', prompt: 'List all active skills' },
    { icon: BookOpen, label: 'Updates', prompt: 'Any skills need updating?' },
    { icon: Wand2, label: 'New skills', prompt: 'What new skills should I add?' },
  ],
};

const DEFAULT_SUGGESTIONS = [
  { icon: Sparkles, label: 'System status', prompt: 'System status summary' },
  { icon: PenLine, label: 'Tasks', prompt: 'What tasks need attention?' },
  { icon: Code2, label: 'Sessions', prompt: 'Show latest session activity' },
];

// ─── Component ───────────────────────────────────────────────

export function QuickChatPanel({ open, onClose, activeTab }: QuickChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [modelOptions, setModelOptions] = useState<ModelOption[]>(DEFAULT_MODEL_OPTIONS);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_OPTIONS[0].id);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Refs for latest state — avoids stale closure in handleSend
  const loadingRef = useRef(loading);
  const isTypingRef = useRef(isTyping);
  loadingRef.current = loading;
  isTypingRef.current = isTyping;

  const suggestions = SUGGESTIONS[activeTab] || DEFAULT_SUGGESTIONS;
  const _tabLabel = TAB_LABELS[activeTab] || 'your dashboard';

  // Fetch available models from portal config on mount
  useEffect(() => {
    fetch('/api/chat/models')
      .then(r => r.json())
      .then((data: { models?: ModelOption[] }) => {
        if (data.models && data.models.length > 0) {
          setModelOptions(data.models);
          setSelectedModel(prev => {
            // Keep current selection if it still exists, else use first
            const stillExists = data.models!.some(m => m.id === prev);
            return stillExists ? prev : data.models![0].id;
          });
        }
      })
      .catch(() => { /* keep defaults */ });
  }, []);

  const selectedModelLabel =
    modelOptions.find(m => m.id === selectedModel)?.label ?? 'Opus 4.6';

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, []);

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

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [open]);

  // Close model dropdown on outside click
  useEffect(() => {
    if (!modelDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [modelDropdownOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      abortControllerRef.current?.abort();
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
        setMessages(prev =>
          prev.map(m => (m.id === messageId ? { ...m, isTyping: false } : m))
        );
        return;
      }
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, content: words.slice(0, i + 1).join(' ') } : m
        )
      );
      i++;
    }, 40);
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = (text ?? input).trim();
      if ((!messageText && !selectedFile) || loadingRef.current || isTypingRef.current) return;

      let finalMessage = messageText;
      let attachedFilePayload: { savedAs: string; mimeType: string; isImage: boolean } | undefined;

      // Handle file upload — upload first, then build payload
      if (selectedFile) {
        try {
          // If already uploaded (has savedAs), reuse; otherwise upload now
          let uploadData = selectedFile.savedAs
            ? { filename: selectedFile.name, savedAs: selectedFile.savedAs, mimeType: selectedFile.mimeType, isImage: selectedFile.isImage, extractedText: selectedFile.extractedText }
            : null;

          if (!uploadData) {
            const formData = new FormData();
            formData.append('file', selectedFile.file);
            const uploadRes = await fetch('/api/chat/upload', { method: 'POST', body: formData });
            if (uploadRes.ok) {
              uploadData = await uploadRes.json();
            }
          }

          if (uploadData) {
            if (uploadData.isImage) {
              // Pass image reference to server — server reads file and builds vision block
              attachedFilePayload = { savedAs: uploadData.savedAs!, mimeType: uploadData.mimeType!, isImage: true };
            } else {
              // Text-extractable file — inline the text content
              const fileText = `[File: ${uploadData.filename}]\n\n${(uploadData.extractedText || '').slice(0, 4000)}`;
              finalMessage = fileText + (messageText ? `\n\n${messageText}` : '\n\nPlease review this file.');
            }
          } else {
            finalMessage = `[File upload failed: ${selectedFile.name}]` + (messageText ? `\n\n${messageText}` : '');
          }
        } catch {
          finalMessage = `[File upload failed: ${selectedFile.name}]` + (messageText ? `\n\n${messageText}` : '');
        }
      }

      if (!finalMessage.trim() && !attachedFilePayload) return;

      const userMsg: ChatMessage = {
        id: genId(),
        role: 'user',
        content: messageText || `📎 ${selectedFile?.name}`,
        timestamp: Date.now(),
        status: 'sending',
      };

      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setSelectedFile(null);
      setLoading(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      try {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        // Build conversation history (exclude system/error messages)
        const history = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

        const res = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: finalMessage,
            model: selectedModel,
            history,
            attachedFile: attachedFilePayload,
            activeTab,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        setMessages(prev =>
          prev.map(m => (m.id === userMsg.id ? { ...m, status: 'sent' as const } : m))
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const reply = data.reply || 'Message sent — Nat Lee is processing.';

        const assistantMsgId = genId();
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
        typewriterEffect(reply, assistantMsgId);
      } catch (err) {
        setMessages(prev =>
          prev.map(m => (m.id === userMsg.id ? { ...m, status: 'error' as const } : m))
        );
        const errorMsg: ChatMessage = {
          id: genId(),
          role: 'system',
          content: err instanceof Error && err.name === 'AbortError'
            ? 'Request timed out. Please try again.'
            : `Error: ${err instanceof Error ? err.message : 'Failed to send message'}`,
          timestamp: Date.now(),
          status: 'error',
        };
        setMessages(prev => [...prev, errorMsg]);
        setLoading(false);
      }
    },
    [input, selectedFile, selectedModel, typewriterEffect]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    e.target.value = '';
  };

  // ─── Drag-and-drop handlers ──────────────────────────────
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate type
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const validExts = ACCEPTED_FILE_TYPES.split(',');
    if (validExts.includes(ext) || ACCEPTED_MIME_RE.test(file.type)) {
      setSelectedFile({ file, name: file.name });
    }
  }, []);

  if (!open) return null;

  const hasMessages = messages.length > 0;

  return (
    <div
      className={`fixed z-50 flex flex-col overflow-hidden transition-all duration-300 ease-out
        bg-white border border-gray-200/80 shadow-2xl rounded-2xl
        ${expanded ? 'w-[720px] h-[700px]' : 'w-[600px] h-[500px]'}
        bottom-6 right-6
        ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
      `}
      style={{ transformOrigin: 'bottom right' }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* ─── Drag overlay ───────────────────────────────── */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#023F59]/80 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-2 text-white">
            <Plus className="w-10 h-10" />
            <span className="text-sm font-medium">Drop file to attach</span>
            <span className="text-xs text-gray-300">PDF, DOC, XLS, CSV, images</span>
          </div>
        </div>
      )}

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={NAT_LEE_AVATAR}
            alt="Nat Lee"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="font-medium text-sm text-[#21262A]">Nat Lee</span>

          {/* Model selector dropdown */}
          <div className="relative" ref={modelDropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(prev => !prev)}
              className="inline-flex items-center gap-1 text-[10px] text-[#107DAC] bg-[#107DAC]/10
                px-2 py-0.5 rounded-full font-mono hover:bg-[#107DAC]/20
                transition-colors duration-150 cursor-pointer select-none"
            >
              {selectedModelLabel}
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {modelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200
                rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                {modelOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedModel(opt.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono
                      transition-colors duration-100
                      ${opt.id === selectedModel
                        ? 'text-[#107DAC] bg-[#107DAC]/10 font-semibold'
                        : 'text-[#21262A] hover:bg-gray-50'
                      }`}
                  >
                    {opt.label}
                    {opt.id === selectedModel && (
                      <span className="ml-2 text-[#31D7DB]">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(e => !e)}
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ─── Content Area ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
        {/* Welcome state */}
        {!hasMessages && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <Sparkles className="w-8 h-8 mb-3" style={{ color: '#107DAC' }} />
            <h2 className="text-xl font-semibold text-[#21262A] mb-1">
              Welcome, Matthew Li
            </h2>
            <p className="text-sm text-gray-500 mb-6">How can I help you today?</p>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-[460px]">
              {suggestions.map(({ icon: Icon, label, prompt }) => (
                <button
                  key={label}
                  onClick={() => handleSend(prompt)}
                  disabled={loading || isTyping}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full
                    text-sm text-[#21262A] bg-white border border-gray-200
                    hover:bg-gray-50 hover:border-gray-300
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors duration-150 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-[#107DAC]" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {(hasMessages || loading) && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
                <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 border border-gray-100">
                  <span className="flex gap-1 text-[#31D7DB]">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ─── Input Bar ────────────────────────────────────── */}
      <div className="shrink-0 px-3 pb-3 pt-2 bg-[#F9FAFB]">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* File chip inside input box */}
          {selectedFile && (
            <div className="px-3 pt-2.5">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-2.5 py-1 text-xs">
                📄 {selectedFile.name}
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-blue-400 hover:text-blue-600 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              resizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you today?"
            rows={1}
            className="w-full resize-none border-0 px-3.5 pt-3 pb-1 text-sm text-[#21262A]
              placeholder:text-gray-400 focus:outline-none focus:ring-0 bg-transparent"
            style={{ minHeight: '36px', maxHeight: '120px' }}
            disabled={loading || isTyping}
          />

          {/* Bottom row: attach | model | send */}
          <div className="flex items-center justify-between px-2 pb-2 pt-0.5">
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || isTyping}
                className="h-7 w-7 flex items-center justify-center rounded-lg
                  text-gray-400 hover:text-gray-600 hover:bg-gray-100
                  disabled:opacity-40 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleSend()}
              disabled={(!input.trim() && !selectedFile) || loading || isTyping}
              className="h-7 w-7 flex items-center justify-center rounded-full
                bg-[#023F59] text-white
                hover:bg-[#034A6C]
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors duration-150"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'system') {
    return (
      <div className="text-center py-1">
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full ${
            message.status === 'error'
              ? 'text-red-600 bg-red-50 border border-red-200'
              : 'text-gray-500'
          }`}
        >
          {message.content}
        </span>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className={`bg-[#023F59] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm max-w-[80%] ${
            message.status === 'error' ? 'opacity-60 ring-1 ring-red-400' : ''
          }`}
        >
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
        src={NAT_LEE_AVATAR}
        alt="Nat Lee"
        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
      />
      <div className="bg-white text-[#21262A] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm max-w-[80%] border border-gray-100">
        <p className="whitespace-pre-wrap break-words">
          {message.content}
          {message.isTyping && (
            <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-text-bottom" />
          )}
        </p>
      </div>
    </div>
  );
}
