import { useLayoutContext } from '@/contexts/layout';
import listStyles from '@/styles/list.scss';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import SidebarHeader from './header';
import styles from './styles.scss';
import SidebarUserProfile from './user-profile';

export default function Sidebar({ children }: PropsWithChildren<unknown>) {
  const [{ isSidebarOpen }] = useLayoutContext();
  return (
    <nav className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <SidebarHeader />
      <SidebarUserProfile />
      {isSidebarOpen && (
        <ul className={clsx(listStyles.list, listStyles.none)}>
          <li>Fuck</li>
          <li>You</li>
          <li>Bish</li>
        </ul>
      )}
      {children}
    </nav>
  );
}
