import Modal from '@/components/ui/modal';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './styles.scss';
import inputStyles from '@/styles/input.scss';
import { Board, createBoard } from '@/services/board';
import { useAuthContext } from '@/contexts/auth';

export default function NewBoardModal({
  onClose,
  onBoardCreated,
}: {
  onClose: () => void;
  onBoardCreated: (board: Board) => void;
}) {
  const [authState] = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, errors } = useForm<NewBoardForm>({ mode: 'onChange' });

  return (
    <Modal
      title='Create a new board'
      okText='Create board'
      onClose={onClose}
      onSubmit={handleSubmit(data => {
        if (!authState.isAuthenticated) return;

        setIsLoading(true);
        createBoard(authState.token, data)
          .then(createdBoard => {
            setIsLoading(false);
            onBoardCreated(createdBoard);
          })
          .catch();
      })}
      className={styles.root}
      isForm
      small
      isLoading={isLoading}
    >
      <input
        className={inputStyles.input}
        id='name'
        name='name'
        placeholder=''
        required
        ref={register({ required: 'Please choose a name for the board' })}
      />
      <label htmlFor='name'>Board name</label>
      {errors.name && <span role='alert'>{errors.name.message}</span>}
    </Modal>
  );
}

type NewBoardForm = Pick<Board, 'name'>;
