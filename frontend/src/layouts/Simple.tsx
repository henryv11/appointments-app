import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';

export default function SimpleLayout({ children }: PropsWithChildren<unknown>) {
    const classes = useStyles();
    return <main className={classes.root}>{children}</main>;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
);
