export function imageManipulation(img: HTMLImageElement, canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('invalid context');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);

  return {
    applyStack(stack: Partial<Stack>) {
      const contrastF = stack.contrast ? getContrastFactor(stack.contrast) : undefined;
      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < imgData.data.length; i += 4) {
        if (stack.brightness) brightness(i, imgData.data, stack.brightness);
        if (contrastF) contrast(i, imgData.data, contrastF);
        if (stack.invert) invert(i, imgData.data);
        if (stack.grayScale) grayScale(i, imgData.data);
      }

      context.putImageData(imgData, 0, 0);
    },

    reset() {
      context.drawImage(img, 0, 0);
    },
  };
}

export function createStack(): Stack {
  return {
    invert: false,
    grayScale: false,
    brightness: 0,
    contrast: 0,
  };
}

function invert(i: number, data: Uint8ClampedArray) {
  data[i] ^= 255;
  data[i + 1] ^= 255;
  data[i + 2] ^= 255;
}

function brightness(i: number, data: Uint8ClampedArray, brightness = 0) {
  data[i] += 255 * (brightness / 100);
  data[i + 1] += 255 * (brightness / 100);
  data[i + 2] += 255 * (brightness / 100);
}

function getContrastFactor(contrast: number) {
  return (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
}

function contrast(i: number, data: Uint8ClampedArray, f = 0) {
  data[i] = clamp(f * (data[i] - 128.0) + 128.0, 0, 255);
  data[i + 1] = clamp(f * (data[i + 1] - 128.0) + 128.0, 0, 255);
  data[i + 2] = clamp(f * (data[i + 2] - 128.0) + 128.0, 0, 255);
}

function grayScale(i: number, data: Uint8ClampedArray) {
  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
  data[i] = avg;
  data[i + 1] = avg;
  data[i + 2] = avg;
}

function clamp(value: number, min: number, max: number) {
  if (value <= min) {
    value = min;
  } else if (value >= max) {
    value = max;
  }
  return value;
}

interface Stack {
  invert: boolean;
  grayScale: boolean;
  brightness: number;
  contrast: number;
}
