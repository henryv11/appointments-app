import React, { useState } from 'react';
import styles from './styles.scss';
import { useUserContext } from '@/contexts/user';
import clsx from 'clsx';
import buttonStyles from '@/styles/button.scss';
import NewProfileImageModal from './components/new-profile-image-modal';
import inputStyles from '@/styles/input.scss';

export default function ProfilePage() {
  const [{ profilePicture, username, email, firstName, lastName, dateOfBirth }] = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.profileImageContainer}>
        <h4 className={styles.header}>
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

      <div className={styles.userFieldsContainer}>
        <h4 className={styles.header}>
          Personal details
          <button className={clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.small)}>Edit</button>
        </h4>
        <input name='username' id='username' value={username} readOnly className={inputStyles.input} />
        <label htmlFor='username'>Username</label>
        <input name='email' id='email' value={email} readOnly className={inputStyles.input} />
        <label htmlFor='email'>Email</label>
        <input name='firstName' id='firstName' value={firstName} readOnly className={inputStyles.input} />
        <label htmlFor='firstName'>First Name</label>
        <input name='lastName' id='lastName' value={lastName} readOnly className={inputStyles.input} />
        <label htmlFor='lastName'>Last Name</label>
        <input
          type='date'
          name='dateOfBirth'
          id='dateOfBirth'
          value={dateOfBirth.split('T')[0]}
          readOnly
          className={inputStyles.input}
        />
        <label htmlFor='dateOfBirth'>Date of birth</label>
      </div>
    </div>
  );
}
