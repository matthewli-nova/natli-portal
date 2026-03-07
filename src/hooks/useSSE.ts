import { useEffect, useRef, useCallback } from 'react';

interface UseSSEOptions {
  url: string;
  events: Record<string, (data: unknown) => void>;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function useSSE({ url, events, onConnected, onDisconnected }: UseSSEOptions) {
  const eventsRef = useRef(events);
  const onConnectedRef = useRef(onConnected);
  const onDisconnectedRef = useRef(onDisconnected);

  eventsRef.current = events;
  onConnectedRef.current = onConnected;
  onDisconnectedRef.current = onDisconnected;

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function connect() {
      if (disposed) return;

      es = new EventSource(url);

      // Use 'connected' custom event from server (not onopen) to avoid double-firing.
      // onopen fires on every reconnect too, but 'connected' only fires once per connection.
      es.addEventListener('connected', () => {
        onConnectedRef.current?.();
      });

      es.onerror = () => {
        onDisconnectedRef.current?.();
        es?.close();
        if (!disposed) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      };

      // Bind named event listeners
      for (const eventName of Object.keys(eventsRef.current)) {
        es.addEventListener(eventName, (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            eventsRef.current[eventName]?.(data);
          } catch { /* ignore parse errors */ }
        });
      }
    }

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
      // Don't call onDisconnected during cleanup — component is unmounting,
      // calling setState would be a no-op on an unmounted component.
    };
  }, [url]);
}
