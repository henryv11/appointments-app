import { useEffect, useRef } from 'react';

export function useTimeout(callback: () => void, ms: number) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), ms);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, [ms]);

  return timeoutRef.current;
}
