import Sidebar from '@/components/ui/sidebar';
import Topbar from '@/components/ui/topbar';
import React, { PropsWithChildren } from 'react';
import styles from './styles.scss';

export default function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className={styles.root}>
      <Topbar />
      <div className={styles.contentWrapper}>
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
