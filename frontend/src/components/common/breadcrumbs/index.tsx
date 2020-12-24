import React, { Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './styles.scss';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const path = ['', ...pathname.split('/').filter(Boolean)];
  return (
    <nav className={styles.root}>
      {path.map((el, i, path) => (
        <Fragment key={el}>
          <span onClick={() => push(path.slice(0, i + 1).join('/'))} className={styles.link} role='navigation'>
            {el || '..'}
          </span>
          {i < path.length - 1 && <span>/</span>}
        </Fragment>
      ))}
    </nav>
  );
}
