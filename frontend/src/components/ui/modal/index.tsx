import { colors } from '@/lib/theme';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import SvgIcon from '../icon/svg';
import styles from './styles.scss';

export default function Modal({ onClose, title, children }: PropsWithChildren<{ onClose: () => void; title: string }>) {
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.backdrop} onClick={() => onClose()} />
        <div className={styles.content}>
          <div className={styles.header}>
            <h4>{title}</h4>
            <button
              className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.danger)}
              onClick={() => onClose()}
            >
              <SvgIcon icon='xCircle' size={18} strokeWidth={16} color={colors.dark.danger.hex()} />
            </button>
          </div>
          <div className={styles.children}>{children}</div>
          <div className={styles.controls}>
            <button className={clsx(buttonStyles.button, buttonStyles.primary)}>Ok</button>
            <button className={clsx(buttonStyles.button, buttonStyles.danger)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
