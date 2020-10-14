import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/Auth';
import { LayoutContextProvider } from './contexts/Layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import NotFoundPage from './pages/NotFound';
import { mainTheme } from './themes/main';

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={mainTheme}>
        <AuthContextProvider>
          <LayoutContextProvider>
            <Router>
              <Switch>
                <Route exact path='/'>
                  <HomePage />
                </Route>
                <Route path='/login'>
                  <LoginPage />
                </Route>
                <Route>
                  <NotFoundPage />
                </Route>
              </Switch>
            </Router>
          </LayoutContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
