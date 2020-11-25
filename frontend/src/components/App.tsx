import { AuthContextProvider } from '@/contexts/auth';
import { LayoutContextProvider } from '@/contexts/layout';
import { ThemeContextProvider } from '@/contexts/theme';
import { RoutePath } from '@/lib/constants';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RequireAuthentication from './higher-order/require-authentication';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import NotFoundPage from './pages/not-found';

export default function App() {
  return (
    <ThemeContextProvider theme='dark'>
      <AuthContextProvider>
        <LayoutContextProvider>
          <Router>
            <Switch>
              <Route path={RoutePath.HOME}>
                <RequireAuthentication>
                  <HomePage />
                </RequireAuthentication>
              </Route>
              <Route exact path={RoutePath.LOGIN}>
                <LoginPage />
              </Route>
              <Route>
                <NotFoundPage />
              </Route>
            </Switch>
          </Router>
        </LayoutContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}
