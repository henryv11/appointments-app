import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { AuthContextProvider } from './contexts/Auth';
import LoginPage from './pages/Login';

export default function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <AuthContextProvider>
                <LoginPage></LoginPage>
            </AuthContextProvider>
        </React.Fragment>
    );
}
