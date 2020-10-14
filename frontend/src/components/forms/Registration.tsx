import Box from '@material-ui/core/Box/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import Divider from '@material-ui/core/Divider/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography/Typography';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { User } from '../../@types/user';
import { useMultiStepForm } from '../../hooks/multi-step-form';

export default function RegistrationForm({ onSubmit = () => void 0 }: RegistrationFormProps) {
  const classes = useStyles();
  const {
    activePart,
    previousPart,
    nextPart,
    isPreviousButtonVisible,
    isNextButtonDisabled,
    isNextButtonVisible,
    isSubmitButtonVisible,
    ...form
  } = useMultiStepForm<RegistrationForm>({ steps: 3 });

  return (
    <form noValidate autoComplete='off' onSubmit={form.handleSubmit(data => onSubmit(data))} className={classes.root}>
      <Box mb={1}>
        <Typography variant='subtitle1'>
          {['Personal information', 'Account information', 'Almost there...'][activePart]}
        </Typography>
        <Divider />
        <Typography variant='caption'>
          {
            [
              'Please tell us about yourself',
              'Please choose your username and password',
              'We need to know this shit man',
            ][activePart]
          }
        </Typography>
      </Box>
      {activePart === 0 && <RegistrationFormPartOne form={form} classes={classes} />}
      {activePart === 1 && <RegistrationFormPartTwo form={form} classes={classes} />}
      {activePart === 2 && <RegistrationFormPartThree form={form} classes={classes} />}
      <Box display='flex' mt={1} justifyContent='space-between'>
        {isPreviousButtonVisible && (
          <Button
            variant='contained'
            className={classes.button}
            onClick={previousPart}
            startIcon={<NavigateBeforeIcon />}
          >
            Previous
          </Button>
        )}
        {isNextButtonVisible && (
          <Button
            variant='contained'
            disabled={isNextButtonDisabled}
            className={classes.button}
            onClick={nextPart}
            endIcon={<NavigateNextIcon />}
          >
            Next
          </Button>
        )}
        {isSubmitButtonVisible && (
          <Button
            disabled={isNextButtonDisabled}
            variant='contained'
            color='primary'
            className={classes.button}
            type='submit'
          >
            Sign Up
          </Button>
        )}
      </Box>
    </form>
  );
}

function RegistrationFormPartOne({
  form: { register, errors },
  classes,
}: {
  form: UseFormMethods<RegistrationForm>;
  classes: ReturnType<typeof useStyles>;
}) {
  return (
    <Fragment>
      <Box display='flex' p={0} m={0}>
        <TextField
          name='firstName'
          label='First Name'
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          required
          className={clsx(classes.input, classes.marginRight)}
          inputRef={register({ required: 'Please enter your first name' })}
        />
        <TextField
          name='lastName'
          label='Last Name'
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          required
          className={clsx(classes.input, classes.marginLeft)}
          inputRef={register({ required: 'Please enter your last name' })}
        />
      </Box>
      <TextField
        name='dateOfBirth'
        label='Date of Birth'
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth?.message}
        required
        type='date'
        inputRef={register({
          required: 'Please enter your date of birth',
          validate(value) {
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            if (isNaN(age) || age <= 0) return 'Please enter correct date';
            if (age <= 12) return 'You must be atleast 12 years old to register';
            if (age >= 120) return "You can't possibly be older than 120";
          },
        })}
        className={classes.input}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Fragment>
  );
}

function RegistrationFormPartTwo({
  form: { errors, register },
  classes,
}: {
  form: UseFormMethods<RegistrationForm>;
  classes: ReturnType<typeof useStyles>;
}) {
  return (
    <Fragment>
      <TextField
        name='username'
        label='Username'
        error={!!errors.username}
        helperText={errors.username?.message}
        required
        className={classes.input}
        inputRef={register({
          required: 'Please enter your username',
          minLength: {
            value: 6,
            message: 'Username has to be atleast 6 characters long',
          },
        })}
      ></TextField>
      <TextField
        name='password'
        label='Password'
        type='password'
        error={!!errors.password}
        helperText={errors.password?.message}
        required
        className={classes.input}
        inputRef={register({
          required: 'Please enter your password',
          minLength: {
            value: 8,
            message: 'Password has to be atleast 8 characters long',
          },
          pattern: {
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            message: 'Password must contain an upper case letter, an lower case letter, and an number',
          },
        })}
      ></TextField>
    </Fragment>
  );
}

function RegistrationFormPartThree({
  form: { errors, register },
  classes,
}: {
  form: UseFormMethods<RegistrationForm>;
  classes: ReturnType<typeof useStyles>;
}) {
  return (
    <Fragment>
      <TextField
        name='email'
        label='Email'
        type='email'
        error={!!errors.email}
        helperText={errors.email?.message}
        required
        className={classes.input}
        inputRef={register({
          required: 'Please enter your email',
        })}
      ></TextField>

      <FormControlLabel
        label='Accept terms and conditions'
        className={classes.input}
        control={
          <Checkbox
            name='acceptedTermsAndConditions'
            icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
            checkedIcon={<CheckBoxIcon fontSize='small' />}
            inputRef={register({
              required: 'You need to accept terms and conditions mate',
            })}
          />
        }
      />
      {!!errors.acceptedTermsAndConditions && (
        <FormHelperText>{errors.acceptedTermsAndConditions?.message}</FormHelperText>
      )}
    </Fragment>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },

    marginLeft: {
      marginLeft: theme.spacing(1),
    },

    marginRight: {
      marginRight: theme.spacing(1),
    },

    input: {
      marginTop: theme.spacing(1),
      width: '100%',
    },

    button: {
      width: '100%',
      margin: theme.spacing(1),
    },
  }),
);

interface RegistrationFormProps {
  onSubmit?: (data: RegistrationForm) => void;
}

type RegistrationForm = Pick<User, 'username' | 'password' | 'dateOfBirth' | 'email' | 'firstName' | 'lastName'> & {
  acceptedTermsAndConditions: boolean;
};
