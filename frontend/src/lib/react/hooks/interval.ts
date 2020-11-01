import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, ms?: number) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (ms === undefined) return;
    intervalRef.current = (setInterval(() => callbackRef.current(), ms) as unknown) as NodeJS.Timeout;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };
  }, [ms]);

  return intervalRef.current;
}
