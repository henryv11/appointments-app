import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { FormEvent, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import SvgIcon from '@/components/common/svg-icon';
import styles from './styles.scss';

const root = document.getElementById('root')!;

export default function Modal({
  title,
  className,
  children,
  large,
  small,
  isForm,
  onSubmit,
  okText = 'ok',
  cancelText = 'cancel',
  onOkClick,
  onCancelClick,
  onCloseClick,
  onBackdropClick,
  isLoading,
  ...rest
}: PropsWithChildren<ModalProps>) {
  const Children = (
    <>
      <div className={clsx(styles.children, className)} {...rest}>
        {children}
      </div>
      <div className={styles.controls}>
        <button
          onClick={onOkClick}
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          type={isForm ? 'submit' : 'button'}
          disabled={isLoading}
        >
          {okText}
        </button>
        <button
          onClick={onCancelClick}
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
        <div className={styles.backdrop} onClick={onBackdropClick} />
        <div className={clsx(styles.content, (large && styles.lg) || (small && styles.sm) || styles.md)}>
          <div className={styles.header}>
            <h4>{title}</h4>
            <button
              className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.danger)}
              onClick={onCloseClick}
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

type StringProps = {
  [k in 'title' | 'okText' | 'cancelText']?: string;
};

type BooleanProps = {
  [k in 'large' | 'small' | 'isForm' | 'isLoading']?: boolean;
};

type DivClickEventProps = {
  [k in 'onBackdropClick']?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

type ButtonClickEventProps = {
  [k in 'onOkClick' | 'onCancelClick' | 'onCloseClick']?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

type ModalProps = {
  title: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
} & StringProps &
  BooleanProps &
  ButtonClickEventProps &
  DivClickEventProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
