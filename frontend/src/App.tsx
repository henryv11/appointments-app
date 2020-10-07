import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <LoginPage></LoginPage>
    </React.Fragment>
  );
}
