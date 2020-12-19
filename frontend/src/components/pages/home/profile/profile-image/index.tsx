import { useUserContext } from '@/contexts/user';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { useState } from 'react';
import rootStyles from '../styles.scss';
import NewProfileImageModal from './new-profile-image-modal';
import styles from './styles.scss';

export default function ProfileImage() {
  const [{ profilePicture }] = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <div className={styles.root}>
      <h4 className={rootStyles.header}>
        Profile picture
        <button
          className={clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.small)}
          onClick={() => setIsModalOpen(true)}
        >
          Choose new
        </button>
      </h4>
      <img className={styles.profileImage} src={profilePicture} />
      {isModalOpen && <NewProfileImageModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
