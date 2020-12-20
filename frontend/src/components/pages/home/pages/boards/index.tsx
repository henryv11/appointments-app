import React, { useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import styles from './styles.scss';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import SvgIcon from '@/components/ui/svg-icon';
import NewBoardModal from './components/new-board-modal';

const boards = [
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
  { id: 'hello', name: 'hello' },
];

export default function BoardsPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <>
      <div className={styles.root}>
        <div className={styles.floatingButtonContainer}>
          <button
            onClick={() => setIsModalOpen(true)}
            className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.primary)}
          >
            <SvgIcon icon='plusCircle' size={48} strokeWidth={24} />
          </button>
        </div>
        <AutoSizer>
          {({ width, height }) => (
            <List width={width} height={height - 30} itemCount={boards.length} itemSize={height / 3}>
              {({ index, style }) => <div style={style}>{boards[index].name}</div>}
            </List>
          )}
        </AutoSizer>
      </div>
      {isModalOpen && (
        <NewBoardModal
          onBoardCreated={board => {
            console.log(board);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
