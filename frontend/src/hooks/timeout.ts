import { useEffect, useRef } from 'react';

export function useTimeout({ callback, ms }: { callback?: () => void; ms: number }) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(callback ? setTimeout(callback, ms) : undefined);
  function clear() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }
  useEffect(() => clear);
  return {
    clear,
    set(callback: () => void, timeMs = ms) {
      clear();
      timeoutRef.current = setTimeout(callback, timeMs);
    },
  };
}
