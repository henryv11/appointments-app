import SvgIcon from '@/components/common/svg-icon';
import { LayoutContextActionType, useLayoutContext } from '@/contexts/layout';
import buttonStyles from '@/styles/button.scss';
import clsx from 'clsx';
import React from 'react';
import Clock from './components/clock';
import styles from './styles.scss';

export default function Header() {
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
