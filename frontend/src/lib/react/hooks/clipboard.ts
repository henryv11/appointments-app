import { useEffect, useRef, useState } from 'react';

export function useClipboard(): [string, typeof copyToClipboard] {
  const inputRef = useRef<HTMLInputElement>();
  const [clipboardValue, setClipboardValue] = useState('');

  useEffect(() => {
    const el = document.createElement('input');
    el.hidden = true;
    document.body.appendChild(el);
    inputRef.current = el;
    return () => {
      if (!inputRef.current) return;
      document.body.removeChild(inputRef.current);
      inputRef.current = undefined;
    };
  }, []);

  function copyToClipboard(value: string) {
    if (!inputRef.current) return;
    const currentFocus: any = document.activeElement;
    inputRef.current.hidden = false;
    inputRef.current.value = value;
    inputRef.current.select();
    if (document.execCommand('copy')) setClipboardValue(value);
    inputRef.current.hidden = true;
    if (currentFocus && currentFocus.focus) currentFocus.focus();
  }

  return [clipboardValue, copyToClipboard];
}
