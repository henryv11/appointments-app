import SvgIcon from '@/components/common/svg-icon';
import { useAuthContext } from '@/contexts/auth';
import { SERVER_BASE_URL } from '@/lib/constants';
import { formatDateString } from '@/lib/date';
import { join } from '@/lib/path';
import { deleteUpload, UserUpload } from '@/services/upload';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { useState } from 'react';
import EditProfileImageModal from './components/edit-profile-image-modal';
import styles from './styles.scss';

export default function UploadedProfileImage({
  upload,
  onUploadDeleted,
}: {
  upload: UserUpload;
  onUploadDeleted: (upload: UserUpload) => void;
}) {
  const [authState] = useAuthContext();
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const imgSrc = join(SERVER_BASE_URL, 'profile-image', upload.fileName);

  return (
    <>
      <div className={styles.root} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <img className={styles.profileImage} src={imgSrc} />
        {isHovering && (
          <div className={styles.overlay}>
            <span className={styles.title}>{upload.originalFileName}</span>
            <div className={styles.controls}>
              <button className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.success)}>
                <SvgIcon icon='check' size={32} />
              </button>
              <button
                className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.primary)}
                onClick={() => setIsEditing(true)}
              >
                <SvgIcon icon='pencil' size={32} />
              </button>
            </div>
            <span className={styles.details}>
              Uploaded @ {formatDateString(new Date(upload.createdAt))}
              <button
                className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.danger)}
                onClick={async () => {
                  if (!authState.isAuthenticated) return;
                  await deleteUpload(authState.token, upload.id);
                  onUploadDeleted(upload);
                }}
              >
                <SvgIcon icon='trash' size={24} />
              </button>
            </span>
          </div>
        )}
      </div>
      {isEditing && <EditProfileImageModal src={imgSrc} onClose={() => setIsEditing(false)} />}
    </>
  );
}
