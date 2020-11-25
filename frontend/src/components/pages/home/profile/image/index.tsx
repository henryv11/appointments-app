import Expandable from '@/components/ui/expand';
import Modal from '@/components/ui/modal';
import { useAuthContext } from '@/contexts/auth';
import { useUserContext } from '@/contexts/user';
import { useAsync } from '@/lib/react/hooks/async';
import { useSimpleReducer } from '@/lib/react/hooks/simple-reducer';
import { listUploads, uploadFile } from '@/services/upload';
import buttonStyles from '@/styles/button.scss';
import inputStyles from '@/styles/input.scss';
import clsx from 'clsx';
import React, { useState } from 'react';
import rootStyles from '../styles.scss';
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
      {profilePicture && <img src={profilePicture}></img>}
      {isModalOpen && <ImageChooserModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function ImageChooserModal({ onClose }: { onClose: () => void }) {
  const [authState] = useAuthContext();
  const {
    token,
    user: { id: userId },
  } = authState.isAuthenticated ? authState : { token: '', user: { id: -1 } };
  const [filters, updateFilters] = useSimpleReducer({ uploadType: 'PROFILE_IMAGE', userId });
  const uploadsPromise = useAsync(!!token && listUploads, [token, filters]);
  return (
    <Modal onClose={onClose} title='Choose a new profile image'>
      <Expandable title='Uploaded files' isExpanded>
        {uploadsPromise.isResolved && <div>you have {uploadsPromise.result.length} uploads</div>}
      </Expandable>
      <Expandable title='Browse'></Expandable>
      <Expandable title='Upload new'>
        <input
          className={inputStyles.input}
          type='file'
          id='input'
          onChange={
            token
              ? ({ target: { files } }) =>
                  files && uploadFile(token, 'PROFILE_IMAGE', files).then(() => updateFilters())
              : () => void 0
          }
        ></input>
        <label htmlFor='input'>Choose a profile image to upload</label>
      </Expandable>
    </Modal>
  );
}
