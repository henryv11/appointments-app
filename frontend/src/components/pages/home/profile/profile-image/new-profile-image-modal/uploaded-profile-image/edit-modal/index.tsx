import Modal from '@/components/ui/modal';
import { useImageManipulation } from '@/lib/react/hooks/image-manipulation';
import { useSimpleReducer } from '@/lib/react/hooks/simple-reducer';
import buttonStyles from '@/styles/button.scss';
import inputStyles from '@/styles/input.scss';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import styles from './styles.scss';

export default function ProfileImageEditModal({ onClose, src }: { onClose: () => void; src: string }) {
  const { canvasRef, imageManipulation } = useImageManipulation({ src });
  const [stack, updateStack] = useSimpleReducer(imageManipulation.createStack());

  useEffect(() => {
    imageManipulation.reset();
    imageManipulation.applyStack(stack);
  }, [stack]);

  return (
    <Modal onClose={onClose} title='Edit profile image' small className={styles.root}>
      <canvas ref={canvasRef} />

      <div className={styles.controls}>
        <input
          className={inputStyles.input}
          id='brightness'
          type='range'
          min={-100}
          max={100}
          step={5}
          value={stack.brightness}
          onChange={ev => {
            updateStack({ brightness: Number(ev.target.value) });
          }}
        />
        <label htmlFor='brightness'>Brightness</label>

        <input
          className={inputStyles.input}
          id='contrast'
          type='range'
          min={-100}
          max={100}
          step={5}
          value={stack.contrast}
          onChange={ev => {
            updateStack({ contrast: Number(ev.target.value) });
          }}
        />
        <label htmlFor='contrast'>Contrast</label>

        <button className={clsx(buttonStyles.button)} onClick={() => updateStack({ invert: !stack.invert })}>
          Invert colors
        </button>

        <button className={clsx(buttonStyles.button)} onClick={() => updateStack({ grayScale: !stack.grayScale })}>
          Grayscale
        </button>

        <button className={clsx(buttonStyles.button)} onClick={() => updateStack(imageManipulation.createStack())}>
          Reset
        </button>
      </div>
    </Modal>
  );
}
