import { useLayoutContext } from '@/contexts/layout';
import clsx from 'clsx';
import React from 'react';
import BoardsList from './components/boards-list';
import Header from './components/header';
import styles from './styles.scss';
import UserProfile from './components/user-profile';

export default function Sidebar() {
  const [{ isSidebarOpen }] = useLayoutContext();
  return (
    <nav className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <Header />
      <nav role='navigation'>
        <UserProfile />
        <BoardsList />
      </nav>
    </nav>
  );
}
