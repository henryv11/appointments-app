import { useEffect, useRef } from 'react';

export function useClickOutSide<T extends HTMLElement = HTMLElement>(onClick: (event: MouseEvent) => void) {
  const elementRef = useRef<T | null>(null);

  function onClickEvent(this: Document, e: MouseEvent) {
    if (elementRef.current?.contains(e.target as Node)) onClick(e);
  }

  useEffect(() => {
    document.addEventListener('click', onClickEvent);
    return document.removeEventListener('click', onClickEvent);
  }, [onClick]);

  return elementRef;
}
