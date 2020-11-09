import SvgIcon from '@/components/ui/icon/svg';
import { useLayoutContext } from '@/contexts/layout';
import { useInterval } from '@/lib/react/hooks/interval';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './styles.scss';

function getDateString() {
  const date = new Date();
  return `${date.toDateString()} ${date.toLocaleTimeString(undefined, {
    hour12: false,
  })}`;
}

function Clock() {
  const [dateString, setDateString] = useState(getDateString());
  useInterval(() => {
    setDateString(getDateString());
  }, 1000);
  return <span>{dateString}</span>;
}

export default function SidebarHeader() {
  const [{ isSidebarOpen }, dispatch] = useLayoutContext();
  return (
    <div className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      {isSidebarOpen && <Clock />}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className={clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.link)}
      >
        {<SvgIcon icon={isSidebarOpen ? 'chevronLeft' : 'chevronRight'} />}
      </button>
    </div>
  );
}
