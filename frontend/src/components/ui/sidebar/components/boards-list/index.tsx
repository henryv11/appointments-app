import SvgIcon from '@/components/ui/svg-icon';
import { useLayoutContext } from '@/contexts/layout';
import { RoutePath } from '@/lib/constants';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './styles.scss';

export default function BoardsList() {
  const { push } = useHistory();
  const [{ isSidebarOpen }] = useLayoutContext();
  const [isBoardsListExpanded, setIsBoardsListExpanded] = useState(false);

  return (
    <div className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      <button className={clsx(buttonStyles.button, buttonStyles.link)} onClick={() => push(RoutePath.BOARDS)}>
        {isSidebarOpen ? (
          <>
            <SvgIcon icon='flipBoard' size={16} />
            boards
          </>
        ) : (
          <SvgIcon icon='flipBoard' size={24} />
        )}
      </button>
      {isSidebarOpen && (
        <button
          className={clsx(buttonStyles.button, buttonStyles.link)}
          onClick={() => setIsBoardsListExpanded(!isBoardsListExpanded)}
        >
          <SvgIcon size={16} icon={isBoardsListExpanded ? 'arrowUp' : 'arrowDown'} strokeWidth={32} />
        </button>
      )}
    </div>
  );
}
