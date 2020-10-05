import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';
import { authContext } from './contexts/auth';

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <authContext.Consumer>
        {auth => (auth.isAuthenticated ? <Home /> : <Redirect to='/login'></Redirect>)}
      </authContext.Consumer>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/about'>About</Link>
              </li>
              <li>
                <Link to='/users'>Users</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path='/about'>
              <About />
            </Route>
            <Route path='/users'>
              <Users />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </React.Fragment>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
