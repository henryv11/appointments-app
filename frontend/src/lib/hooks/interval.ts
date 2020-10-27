import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, ms: number) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    intervalRef.current = setInterval(() => callbackRef.current(), ms);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };
  }, [ms]);

  return intervalRef.current;
}
