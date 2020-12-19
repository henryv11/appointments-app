import { createStack, imageManipulation } from '@/lib/image-manipulation';
import { useEffect, useRef } from 'react';

const blankImageManipulation = { applyStack: noop, reset: noop };

export function useImageManipulation({ src }: { src: string }) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const im = useRef<ReturnType<typeof imageManipulation>>(blankImageManipulation);

  useEffect(() => {
    imgRef.current = new Image();
    imgRef.current.src = src;
  }, [src]);

  useEffect(() => {
    if (canvasRef.current && imgRef.current) {
      im.current = imageManipulation(imgRef.current, canvasRef.current);
    }
  }, [canvasRef.current, imgRef.current]);

  return {
    canvasRef,
    imageManipulation: {
      ...im.current,
      createStack,
    },
  } as const;
}

function noop() {}
