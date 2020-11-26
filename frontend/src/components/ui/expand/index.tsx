import React, { PropsWithChildren, useEffect, useState } from 'react';
import SvgIcon from '../icon/svg';
import styles from './styles.scss';

export default function Expandable({
  children,
  title,
  isExpanded: isExpanedProp = false,
}: PropsWithChildren<{ title: string; isExpanded?: boolean }>) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(isExpanedProp);
  }, [isExpanedProp]);

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