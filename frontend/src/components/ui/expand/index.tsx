import React, { PropsWithChildren, useState } from 'react';
import SvgIcon from '../icon/svg';
import styles from './styles.scss';

export default function Expandable({ children, title }: PropsWithChildren<{ title: string }>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h4>{title}</h4>
        <SvgIcon icon={isExpanded ? 'arrowUp' : 'arrowDown'} size={16} strokeWidth={12} />
      </div>
      {isExpanded && <div>{children}</div>}
    </div>
  );
}
