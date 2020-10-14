import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React from 'react';
import { useLayoutContext } from '../contexts/Layout';

export default function AppBar() {
  const classes = useStyles();
  const [{ isSidebarOpen }, dispatch] = useLayoutContext();

  return (
    <MuiAppBar
      position='fixed'
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isSidebarOpen,
      })}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={() => dispatch({ type: 'OPEN_SIDEBAR' })}
          edge='start'
          className={clsx(classes.menuButton, {
            [classes.hide]: isSidebarOpen,
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' noWrap>
          Mini variant drawer
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: theme.mixins.drawer.width,
      width: `calc(100% - ${theme.mixins.drawer.width}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
  }),
);
