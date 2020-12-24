import { Board } from '@/services/board';
import React, { PropsWithChildren } from 'react';
import styles from './styles.scss';

export default function BoardListItem(props: PropsWithChildren<Board>) {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <pre>{JSON.stringify(props)}</pre>
      </div>
    </div>
  );
}
