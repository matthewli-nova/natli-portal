import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────

type SSEListener = (data: unknown) => void;

interface SSEContextValue {
  connected: boolean;
  subscribe: (event: string, fn: SSEListener) => () => void;
}

// ─── Context ─────────────────────────────────────────────────

const SSEContext = createContext<SSEContextValue>({
  connected: false,
  subscribe: () => () => {},
});

export function useSSEContext() {
  return useContext(SSEContext);
}

// ─── Provider — one permanent EventSource for the whole app ──

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);

  // Map of eventName → Set of listener functions
  const listenersRef = useRef<Map<string, Set<SSEListener>>>(new Map());

  const subscribe = useCallback((event: string, fn: SSEListener) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(fn);
    return () => {
      listenersRef.current.get(event)?.delete(fn);
    };
  }, []);

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function dispatch(event: string, data: unknown) {
      listenersRef.current.get(event)?.forEach(fn => {
        try { fn(data); } catch { /* ignore */ }
      });
    }

    function connect() {
      if (disposed) return;
      es = new EventSource('/api/events');

      es.addEventListener('connected', () => {
        setConnected(true);
      });

      es.onerror = () => {
        setConnected(false);
        es?.close();
        if (!disposed) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      };

      // Forward all named events to subscribers
      const KNOWN_EVENTS = ['pulse', 'health', 'session', 'cron', 'alert'];
      for (const name of KNOWN_EVENTS) {
        es.addEventListener(name, (e: MessageEvent) => {
          try {
            dispatch(name, JSON.parse(e.data));
          } catch { /* ignore */ }
        });
      }
    }

    connect();
    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
    };
  }, []);

  return (
    <SSEContext.Provider value={{ connected, subscribe }}>
      {children}
    </SSEContext.Provider>
  );
}
