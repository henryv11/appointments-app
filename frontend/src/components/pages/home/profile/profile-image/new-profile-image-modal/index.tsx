import Expandable from '@/components/ui/expand';
import Modal from '@/components/ui/modal';
import { useAuthContext } from '@/contexts/auth';
import { usePagination } from '@/lib/react/hooks/pagination';
import { useSimpleReducer } from '@/lib/react/hooks/simple-reducer';
import { listUploads, uploadFiles, UserUpload } from '@/services/upload';
import buttonStyles from '@/styles/button.scss';
import inputStyles from '@/styles/input.scss';
import skeletonStyles from '@/styles/skeleton.scss';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';
import styles from './styles.scss';
import UploadedProfileImage from './uploaded-profile-image';

const UPLOAD_TYPE = 'PROFILE_IMAGE';
const LIMIT = 12;
const COLUMNS = 3;

export default function NewImageModal({ onClose }: { onClose: () => void }) {
  const [authState] = useAuthContext();
  const {
    token,
    user: { id: userId },
  } = authState.isAuthenticated ? authState : { token: '', user: { id: -1 } };

  const [state, updateState] = useSimpleReducer({
    totalRows: 0,
    offset: 0,
    files: null as FileList | null,
    uploads: [] as UserUpload[],
    isLoading: false,
  });

  const pagination = usePagination({
    currentOffset: state.offset,
    totalRows: state.totalRows,
    limit: LIMIT,
  });

  useEffect(() => {
    loadUploads();
  }, []);

  async function loadUploads(offset: number = 0) {
    if (state.isLoading) return;
    updateState({ isLoading: true });
    const uploads = await listUploads(token, { limit: LIMIT, uploadType: UPLOAD_TYPE, offset, userId });
    updateState({
      totalRows: Number(uploads[0]?.totalRows || 0),
      uploads: state.uploads.concat(uploads),
      offset,
      isLoading: false,
    });
  }

  const uploadsLength = state.uploads.length;

  return (
    <Modal onClose={onClose} title='Choose a new profile image' className={styles.root} large>
      <Expandable title='Uploaded profile images' isExpanded className={styles.uploadsExpandable}>
        <AutoSizer>
          {({ width, height }) => (
            <Grid
              width={width}
              height={height}
              columnWidth={width / COLUMNS - 6}
              rowHeight={height / COLUMNS}
              columnCount={COLUMNS}
              rowCount={state.totalRows / COLUMNS}
            >
              {({ columnIndex, style, rowIndex }) => {
                const idx = rowIndex * COLUMNS + columnIndex;
                const upload = state.uploads[idx];

                if (upload) {
                  return (
                    <div style={style}>
                      <UploadedProfileImage
                        upload={upload}
                        onUploadDeleted={({ id }) =>
                          updateState({
                            uploads: state.uploads.filter(upload => upload.id !== id),
                            totalRows: state.totalRows - 1,
                          })
                        }
                      />
                    </div>
                  );
                }

                if (idx === uploadsLength && pagination.hasNextPage) loadUploads(pagination.nextOffset);

                return (
                  <div style={style} className={styles.skeleton}>
                    <div className={skeletonStyles.skeleton}></div>
                  </div>
                );
              }}
            </Grid>
          )}
        </AutoSizer>
      </Expandable>
      <Expandable title='Browse'></Expandable>
      <Expandable title='Upload new' isExpanded className={styles.uploadNew}>
        <input
          className={inputStyles.input}
          type='file'
          id='input'
          accept='image/*'
          multiple
          onChange={token ? ({ target: { files } }) => files && updateState({ files }) : () => void 0}
        ></input>
        <label htmlFor='input'>Choose a profile image to upload</label>
        {state.files && (
          <button
            className={clsx(buttonStyles.button, buttonStyles.success)}
            onClick={async () => {
              const uploads = await uploadFiles(token, UPLOAD_TYPE, state.files!);
              const len = uploads.length;
              updateState({
                uploads: state.uploads.concat(uploads),
                totalRows: state.totalRows + len,
              });
            }}
          >
            {`Upload file${state.files.length > 1 ? 's' : ''}`}
          </button>
        )}
      </Expandable>
    </Modal>
  );
}
