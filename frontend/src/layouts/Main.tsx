import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import AppBar from '../components/AppBar';
import Drawer from '../components/Drawer';
import { LayoutContextProvider } from '../contexts/Layout';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

interface MainLayoutProps {
    content: JSX.Element;
}

export default function MainLayout({ content }: MainLayoutProps) {
    const classes = useStyles();
    return (
        <LayoutContextProvider>
            <div className={classes.root}>
                <AppBar />
                <Drawer />
                <main className={classes.content}>{content}</main>
            </div>
        </LayoutContextProvider>
    );
}
