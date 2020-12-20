import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { FormEvent, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import SvgIcon from '../svg-icon';
import styles from './styles.scss';

const root = document.getElementById('root')!;

function noop() {}

export default function Modal({
  onClose,
  title,
  className,
  children,
  large,
  small,
  isForm,
  onSubmit,
  okText = 'ok',
  cancelText = 'cancel',
  onOkClicked = noop,
  onCancelClicked = noop,
  isLoading,
  ...rest
}: PropsWithChildren<
  { onClose: () => void; title: string; onSubmit?: (event: FormEvent<HTMLFormElement>) => void } & Partial<
    Record<'large' | 'small' | 'isForm' | 'isLoading', boolean>
  > &
    Partial<Record<'title' | 'okText' | 'cancelText', string>> &
    Partial<Record<'onOkClicked' | 'onCancelClicked', () => void>> &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>) {
  const Children = (
    <>
      <div className={clsx(styles.children, className)} {...rest}>
        {children}
      </div>
      <div className={styles.controls}>
        <button
          onClick={() => onOkClicked()}
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          type={isForm ? 'submit' : 'button'}
          disabled={isLoading}
        >
          {okText}
        </button>
        <button
          onClick={() => onCancelClicked()}
          className={clsx(buttonStyles.button, buttonStyles.danger)}
          type={isForm ? 'reset' : 'button'}
          disabled={isLoading}
        >
          {cancelText}
        </button>
      </div>
    </>
  );
  return createPortal(
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.backdrop} onClick={() => onClose()} />
        <div className={clsx(styles.content, (large && styles.lg) || (small && styles.sm) || styles.md)}>
          <div className={styles.header}>
            <h4>{title}</h4>
            <button
              className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.danger)}
              onClick={() => onClose()}
            >
              <SvgIcon icon='xCircle' size={24} strokeWidth={24} />
            </button>
          </div>
          {isForm ? (
            <form className={styles.childrenContainer} onSubmit={onSubmit}>
              {Children}
            </form>
          ) : (
            <div className={styles.childrenContainer}>{Children}</div>
          )}
        </div>
      </div>
    </div>,
    root,
  );
}
