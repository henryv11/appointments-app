import { AuthContextProvider } from '@/contexts/auth';
import { LayoutContextProvider } from '@/contexts/layout';
import { ThemeContextProvider } from '@/contexts/theme';
import { RoutePath } from '@/lib/constants';
import { useAlert } from '@/lib/react/hooks/alert';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import NotFoundPage from './pages/not-found';
import RegistrationPage from './pages/registration';

export default function App() {
  const alert = useAlert({ duration: 1000 });
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <LayoutContextProvider>
          <button onClick={() => alert()}>NINGINJGINIGNIGNI</button>
          <Router>
            <Switch>
              <Route exact path={RoutePath.LOGIN} component={LoginPage} />
              <Route exact path={RoutePath.REGISTRATION} component={RegistrationPage} />
              <Route path={RoutePath.HOME} component={HomePage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </LayoutContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}
