import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import AppBar from '../components/AppBar';
import Drawer from '../components/Drawer';

export default function MainLayout({ children }: PropsWithChildren<unknown>) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar />
      <Drawer />
      <main className={classes.content}>{children}</main>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      padding: theme.spacing(3),
      marginTop: theme.mixins.toolbar.height,
    },
  }),
);
