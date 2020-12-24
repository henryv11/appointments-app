import React, { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import styles from './styles.scss';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import SvgIcon from '@/components/common/svg-icon';
import NewBoardModal from './components/new-board-modal';
import { useAuthContext } from '@/contexts/auth';
import { useSimpleReducer } from '@/lib/react/hooks/simple-reducer';
import { Board, listBoards } from '@/services/board';
import { usePagination } from '@/lib/react/hooks/pagination';
import skeletonStyles from '@/styles/skeleton.scss';
import BoardListItem from './components/board-list-item';

const LIMIT = 12;

export default function BoardsPage() {
  const [authState] = useAuthContext();
  const [state, updateState] = useSimpleReducer({
    totalRows: 0,
    offset: 0,
    boards: [] as Board[],
    isLoading: false,
    isModalOpen: false,
  });
  const pagination = usePagination({ currentOffset: state.offset, totalRows: state.totalRows, limit: LIMIT });
  const boardsLength = state.boards.length;

  useEffect(() => {
    loadBoards();
  }, []);

  async function loadBoards(offset = 0) {
    if (state.isLoading || !authState.isAuthenticated) return;
    updateState({ isLoading: true });
    const boards = await listBoards(authState.token, {
      limit: LIMIT,
      offset,
    });
    updateState({
      totalRows: Number(boards[0]?.totalRows ?? state.totalRows),
      boards: state.boards.concat(boards),
      offset,
      isLoading: false,
    });
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.floatingButtonContainer}>
          <button
            onClick={() => updateState({ isModalOpen: true })}
            className={clsx(buttonStyles.button, buttonStyles.link, buttonStyles.primary)}
          >
            <SvgIcon icon='plusCircle' size={48} strokeWidth={24} />
          </button>
        </div>
        <AutoSizer>
          {({ width, height }) => (
            <List width={width} height={height - 30} itemCount={state.totalRows} itemSize={(height - 30) / 3}>
              {({ index, style }) => {
                const board = state.boards[index];

                if (board)
                  return (
                    <div style={style}>
                      <BoardListItem {...state.boards[index]} />
                    </div>
                  );

                if (index === boardsLength && pagination.hasNextPage) loadBoards(pagination.nextOffset);

                return (
                  <div style={style}>
                    <div className={skeletonStyles.skeleton}></div>
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </div>
      {state.isModalOpen && (
        <NewBoardModal
          onBoardCreated={board =>
            updateState({ boards: state.boards.concat(board), totalRows: state.totalRows + 1, isModalOpen: false })
          }
          onClose={() => updateState({ isModalOpen: false })}
        />
      )}
    </>
  );
}
