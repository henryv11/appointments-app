import { useAuthContext } from '@/components/contexts/auth';
import { useLayoutContext } from '@/components/contexts/layout';
import clsx from 'clsx';
import React from 'react';
import styles from './styles.scss';

export default function SidebarUserProfile() {
  const [authState] = useAuthContext();
  const [{ isSidebarOpen }] = useLayoutContext();
  if (!authState.isAuthenticated) return null;
  const { user } = authState;
  return (
    <div className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <div className={styles.profileImage}>
        <img src='https://i.stack.imgur.com/l60Hf.png'></img>
      </div>
      {isSidebarOpen && (
        <div>
          <p>{user.username}</p>
        </div>
      )}
    </div>
  );
}
