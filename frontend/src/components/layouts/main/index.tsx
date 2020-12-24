import Sidebar from '@/components/common/sidebar';
import Topbar from '@/components/common/topbar';
import React, { PropsWithChildren } from 'react';
import styles from './styles.scss';

export default function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className={styles.root}>
      <Topbar />
      <div className={styles.contentContainer}>
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
