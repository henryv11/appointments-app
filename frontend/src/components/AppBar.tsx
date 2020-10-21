import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useAuthContext } from '../contexts/Auth';
import { useLayoutContext } from '../contexts/Layout';
import { logoutUser } from '../services/auth';

export default function AppBar() {
  const classes = useStyles();
  const [{ isSidebarOpen }, layoutDispatch] = useLayoutContext();
  const [{ token }, authDispatch] = useAuthContext();
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState<undefined | HTMLElement>(undefined);

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
          onClick={() => layoutDispatch({ type: 'OPEN_SIDEBAR' })}
          edge='start'
          className={clsx(classes.menuButton, {
            [classes.hide]: isSidebarOpen,
          })}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          edge='end'
          aria-label='account of current user'
          aria-labelledby='account-menu'
          aria-haspopup='true'
          onClick={event => setAccountMenuAnchorEl(event.currentTarget)}
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <Typography variant='h6' noWrap>
          Iou
        </Typography>
        <Menu
          open={!!accountMenuAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => setAccountMenuAnchorEl(undefined)}
          id='account-menu'
          anchorEl={accountMenuAnchorEl}
          keepMounted
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>My Account</MenuItem>
          <MenuItem
            onClick={async () => {
              await logoutUser(token!);
              authDispatch({ type: 'LOG_OUT' });
            }}
          >
            Log Out
          </MenuItem>
        </Menu>
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
