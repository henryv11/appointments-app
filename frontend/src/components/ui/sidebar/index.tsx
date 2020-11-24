import { useLayoutContext } from '@/contexts/layout';
import clsx from 'clsx';
import React from 'react';
import BoardsList from './boards-list';
import SidebarHeader from './header';
import styles from './styles.scss';
import SidebarUserProfile from './user-profile';

export default function Sidebar() {
  const [{ isSidebarOpen }] = useLayoutContext();
  return (
    <nav className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <SidebarHeader />
      <nav role='navigation'>
        <SidebarUserProfile />
        <BoardsList />
      </nav>
    </nav>
  );
}
