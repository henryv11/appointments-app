import clsx from 'clsx';
import React from 'react';
import { useRegistrationFormContext } from '../..';
import styles from './styles.scss';
import buttonStyles from '@/styles/button.scss';

export default function ({
  onPreviousButtonClick,
  isNextButtonDisabled,
  onNextButtonClick,
}: {
  isNextButtonDisabled: boolean;
  onNextButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPreviousButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  const [{ currentStep }] = useRegistrationFormContext();

  console.log({ currentStep });

  return (
    <div className={styles.root}>
      {currentStep >= 1 && (
        <button className={clsx(buttonStyles.button, buttonStyles.primary)} onClick={onPreviousButtonClick}>
          Previous
        </button>
      )}
      <button
        className={clsx(buttonStyles.button, buttonStyles.primary)}
        disabled={isNextButtonDisabled}
        onClick={onNextButtonClick}
      >
        {currentStep < 3 ? 'Next' : 'Sign up'}
      </button>
    </div>
  );
}
