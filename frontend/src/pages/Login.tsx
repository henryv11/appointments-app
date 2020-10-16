import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box/Box';
import Button from '@material-ui/core/Button/Button';
import Divider from '@material-ui/core/Divider/Divider';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from '../components/forms/Login';
import RegistrationForm from '../components/forms/Registration';
import { useAuthContext } from '../contexts/Auth';
import { useTimeout } from '../hooks/timeout';
import SimpleLayout from '../layouts/Simple';
import { loginUser, registerUser } from '../services/auth';

export default function LoginPage() {
  const classes = useStyles();
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(true);
  const [error, setError] = useState('');
  const { set: setTimeout } = useTimeout({ ms: 5000 });

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <SimpleLayout>
      <Paper className={classes.root}>
        <Box display='flex' mx={2} py={1}>
          <Typography variant='h4'>{isRegistration ? 'Registration' : 'Login'}</Typography>
          {isRegistration ? (
            <PersonAddIcon className={classes.headerIcon} />
          ) : (
            <PersonIcon className={classes.headerIcon} />
          )}
        </Box>
        <Divider></Divider>
        <Box mx={6} my={4}>
          {error && <Alert severity='error'>{error}</Alert>}
          {isRegistration ? (
            <RegistrationForm
              onSubmit={async data => {
                try {
                  const payload = await registerUser(data);
                  dispatch({ type: 'LOG_IN', payload });
                } catch (error) {
                  setError(error.message);
                  setTimeout(() => setError(''));
                }
              }}
            ></RegistrationForm>
          ) : (
            <LoginForm
              onSubmit={async data => {
                try {
                  const payload = await loginUser(data);
                  dispatch({ type: 'LOG_IN', payload });
                } catch (error) {
                  setError('login failed');
                  setTimeout(() => setError(''));
                }
              }}
            ></LoginForm>
          )}
        </Box>
        <Button color='primary' fullWidth onClick={() => setIsRegistration(!isRegistration)}>
          {isRegistration ? 'Already have an account? Log in instead.' : "Don't have an account? Register here."}
        </Button>
      </Paper>
    </SimpleLayout>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
      marginTop: theme.spacing(20),
      padding: theme.spacing(4),
      boxShadow: theme.shadows[2],
      borderRadius: theme.shape.borderRadius,
      width: '90%',
      [theme.breakpoints.up('sm')]: {
        width: '80%',
      },
      [theme.breakpoints.up('md')]: {
        width: '60%',
      },
      [theme.breakpoints.up('lg')]: {
        width: '40%',
      },
    },

    headerIcon: {
      marginLeft: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
  }),
);