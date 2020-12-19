import React from 'react';
import UserFields from './fields';
import ProfileImage from './profile-image';
import styles from './styles.scss';

export default function ProfilePage() {
  return (
    <div className={styles.root}>
      <ProfileImage />
      <UserFields />
    </div>
  );
}
