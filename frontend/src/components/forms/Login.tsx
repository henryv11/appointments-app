import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../@types/user';

export default function LoginForm({ onSubmit = () => void 0 }: LoginFormProps) {
    const classes = useStyles();
    const { register, handleSubmit, errors } = useForm<LoginForm>();

    return (
        <form noValidate autoComplete='off' onSubmit={handleSubmit(data => onSubmit(data))} className={classes.root}>
            <TextField
                name='username'
                type='text'
                label={'Username'}
                required
                inputRef={register({
                    required: 'Username is required',
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
            />
            <TextField
                name='password'
                type='password'
                label={'Password'}
                required
                inputRef={register({
                    required: 'Password is required',
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
            />
            <Button variant='contained' color='primary' type='submit'>
                Log In
            </Button>
        </form>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            '& input': {
                marginTop: theme.spacing(1),
            },
            '& button': {
                marginTop: theme.spacing(3),
            },
        },
    }),
);

interface LoginFormProps {
    onSubmit?: (data: LoginForm) => void;
}

type LoginForm = Pick<User, 'username' | 'password'>;
