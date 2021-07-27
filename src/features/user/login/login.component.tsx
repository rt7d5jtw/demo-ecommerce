import * as React from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../../user/thunks';

type FormValues = {
  email: string;
  password: string;
  submitted: boolean;
};

type warningValues = {
  emailWarning: string;
  passwordWarning: string;
  warnings: boolean;
};

export const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const ref = React.useRef<HTMLInputElement>(null);
  const [warning, setWarning] = React.useState<warningValues>({
    emailWarning: '',
    passwordWarning: '',
    warnings: false,
  });
  const [input, setInput] = React.useState<FormValues>({
    email: '',
    password: '',
    submitted: false,
  });

  function isEmail(expression: string) {
    return expression.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi) !== null;
  }

  function isPassword(expression: string) {
    return expression.match(/^(?=.*[A-Za-z])[A-Za-z\d!]{6,}$/gi) !== null;
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    setInput({ ...input, submitted: true });

    if (input.email.length === 0 || input.password.length === 0) {
      setWarning({ ...warning, passwordWarning: 'Empty fields!' });
    }

    if (!isEmail(input.email) && input.email) {
      setWarning({ ...warning, emailWarning: 'Field must be an email!' });
      return;
    }

    if (!isPassword(input.password) && input.password) {
      setWarning({ ...warning, passwordWarning: 'Field must be an password!' });
      return;
    }

    if (isEmail(input.email) && isPassword(input.password)) {
      const inputData = (({ email, password }) => ({ email, password }))(input);
      console.log(inputData);
      dispatch(loginRequest(inputData));
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.name === 'email'
      ? setInput({ ...input, email: event.target.value })
      : event.target.name === 'password'
      ? setInput({ ...input, password: event.target.value })
      : null;

    if (event.target.name === 'email') {
      isEmail(event.target.value) ? setWarning({ ...warning, emailWarning: '' }) : null;
    } else if (event.target.name === 'password') {
      isPassword(event.target.value) ? setWarning({ ...warning, passwordWarning: '' }) : null;
    }
  }

  return (
    <div className='login'>
      <img className='login__picture' src={'https://i.imgur.com/0c2Zp0s.jpg'} />
      <div className='login__wrapper'>
        <h1>Login</h1>
        <form className='form' onSubmit={handleSubmit} method='POST'>
          <label>Email</label>
          <input type='email' name='email' placeholder='Email' id='email' onChange={handleChange} />
          <p className='warning-text'>{warning.emailWarning}</p>
          <label>Password</label>
          <input
            type='password'
            name='password'
            placeholder='Password'
            id='password'
            onChange={handleChange}
            ref={ref}
          />
          <p className='warning-text'>{warning.passwordWarning}</p>
          <input type='submit' value='Login' />
          <Link to='/register'>
            <p className='register-link'>Dont have an account yet? Click here to register</p>
          </Link>
        </form>
      </div>
    </div>
  );
};
