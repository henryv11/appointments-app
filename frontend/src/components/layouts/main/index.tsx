import AppBar from '@/components/ui/app-bar';
import Drawer from '@/components/ui/drawer';
import React, { PropsWithChildren } from 'react';
import styles from './styles.css';

export default function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className={styles.root}>
      <AppBar />
      <div className={styles.contentWrapper}>
        <Drawer />
        <main>{children}</main>
      </div>
    </div>
  );
}
