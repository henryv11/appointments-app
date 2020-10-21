import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/auth';
import { LayoutContextProvider } from './contexts/layout';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import NotFoundPage from './pages/not-found';

export default function App() {
  return (
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
  );
}
