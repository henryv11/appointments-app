import SvgIcon from '@/components/ui/icon/svg';
import { LayoutContextActionType, useLayoutContext } from '@/contexts/layout';
import { formatDateString } from '@/lib/date';
import { useInterval } from '@/lib/react/hooks/interval';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './styles.scss';

export default function SidebarHeader() {
  const [{ isSidebarOpen }, dispatch] = useLayoutContext();
  return (
    <div className={clsx(styles.root, isSidebarOpen ? styles.open : styles.closed)}>
      {isSidebarOpen && <Clock />}
      <button
        onClick={() => dispatch({ type: LayoutContextActionType.TOGGLE_SIDEBAR })}
        className={clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.link)}
      >
        {<SvgIcon icon={isSidebarOpen ? 'chevronLeft' : 'chevronRight'} />}
      </button>
    </div>
  );
}

function Clock() {
  const [dateString, setDateString] = useState(formatDateString(new Date()));
  useInterval(() => {
    setDateString(formatDateString(new Date()));
  }, 1000);
  return <span>{dateString}</span>;
}
