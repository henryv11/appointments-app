import React, { Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './styles.scss';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const path = pathname.split('/').filter(Boolean);
  const length = path.length;
  return (
    <nav className={styles.root}>
      <span onClick={() => push('/')} className={styles.link}>
        ..
      </span>
      {!!length && <span>/</span>}
      {path.map((el, i) => (
        <Fragment key={el}>
          <span onClick={() => push('/' + path.slice(0, i + 1).join('/'))} className={styles.link}>
            {el}
          </span>
          {i < length - 1 && <span>/</span>}
        </Fragment>
      ))}
    </nav>
  );
}
