import { useLayoutContext } from '@/contexts/layout';
import { useUserContext } from '@/contexts/user';
import { RoutePath } from '@/lib/constants';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.scss';

export default function SidebarUserProfile() {
  const [{ isSidebarOpen }] = useLayoutContext();
  const [{ profilePicture, username }] = useUserContext();
  return (
    <div className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <Link className={styles.profileImage} to={{ pathname: RoutePath.PROFILE }}>
        <img src={profilePicture}></img>
      </Link>
      {isSidebarOpen && (
        <div>
          <p>{username}</p>
        </div>
      )}
    </div>
  );
}
