import { useCallback, useEffect, useRef, useState } from 'react';

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  cb: IntersectionObserverCallback,
  { rootMargin, threshold }: Partial<Omit<IntersectionObserverInit, 'root'>> = {},
) {
  const [node, setNode] = useState<T | null>(null);
  const observerRef = useRef<IntersectionObserver>();
  const ref = useCallback(setNode, []);

  useEffect(() => {
    if (!node) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(cb, { rootMargin, threshold });
    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [node, cb, rootMargin, threshold]);

  return ref;
}
