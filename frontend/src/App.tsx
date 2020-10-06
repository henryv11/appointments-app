import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import Home from './pages/home';

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      {/* <authContext.Consumer> */}
      {/* {auth => (auth.isAuthenticated ? <Home /> : <Redirect to='/login'></Redirect>)} */}

      {<Home />}
      {/* </authContext.Consumer> */}
    </React.Fragment>
  );
}
