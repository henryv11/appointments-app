import SvgIcon from '@/components/ui/icon/svg';
import buttonStyles from '@/styles/button.css';
import clsx from 'clsx';
import React, { PropsWithChildren, useState } from 'react';
import styles from './styles.css';

export default function Drawer({ children }: PropsWithChildren<unknown>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <nav className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.outline)}
      >
        {<SvgIcon icon={isSidebarOpen ? 'chevronLeft' : 'chevronRight'} />}
      </button>
      {children}
    </nav>
  );
}
