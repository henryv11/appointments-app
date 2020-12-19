import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import SvgIcon from '../icon/svg';
import styles from './styles.scss';

const root = document.getElementById('root')!;

export default function Modal({
  onClose,
  title,
  className,
  children,
  large,
  small,
  medium = true,
  ...rest
}: PropsWithChildren<
  { onClose: () => void; title: string } & Partial<Record<'large' | 'small' | 'medium', boolean>> &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>) {
  return createPortal(
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.backdrop} onClick={() => onClose()} />
        <div className={clsx(styles.content, large && styles.lg, medium && styles.md, small && styles.sm)}>
          <div className={styles.header}>
            <h4>{title}</h4>
            <button
              className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.danger)}
              onClick={() => onClose()}
            >
              <SvgIcon icon='xCircle' size={16} strokeWidth={32} />
            </button>
          </div>
          <div className={clsx(styles.children, className)} {...rest}>
            {children}
          </div>
          <div className={styles.controls}>
            <button className={clsx(buttonStyles.button, buttonStyles.primary)}>Ok</button>
            <button className={clsx(buttonStyles.button, buttonStyles.danger)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>,
    root,
  );
}
