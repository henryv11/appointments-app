import { useAuthContext } from '@/contexts/auth';
import { useLayoutContext } from '@/contexts/layout';
import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './styles.scss';

export default function SidebarUserProfile() {
  const [authState] = useAuthContext();
  const [{ isSidebarOpen }] = useLayoutContext();
  const history = useHistory();
  if (!authState.isAuthenticated) return null;
  const { user } = authState;
  return (
    <div className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <div className={styles.profileImage}>
        <img src='https://i.stack.imgur.com/l60Hf.png' onClick={() => history.push('/profile')}></img>
      </div>
      {isSidebarOpen && (
        <div>
          <p>{user.username}</p>
        </div>
      )}
    </div>
  );
}
