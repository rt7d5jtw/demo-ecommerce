import * as React from 'react';
import './login.css';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../user/thunks';
import { useForm, SubmitHandler } from 'react-hook-form';
import { selectLoggedIn } from '../selectors';

type FormValues = {
  email: string;
  password: string;
};

export const Login = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const loggedIn = useSelector(selectLoggedIn);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(loginRequest(data));
    if (loggedIn === true) {
      push('/');
    } else {
      setError('password', { type: 'manual', message: 'No such user exists' });
    }
  };

  const { push } = useHistory();
  const dispatch = useDispatch();

  return (
    <div className='login'>
      <div
        className='login-picture'
        style={{ backgroundImage: `url('https://i.imgur.com/0c2Zp0s.jpg')` }}
      ></div>
      <div className='login-wrapper'>
        <h1>Login</h1>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            type='email'
            placeholder='Email'
            {...register('email', { required: 'Please input valid email' })}
            id='email'
          />
          {errors?.email && <p className='login-text'>{errors.email.message}</p>}
          <div>
            <label>Password</label>
            <input
              type='password'
              placeholder='Password'
              {...register('password', { required: 'Please input valid password' })}
              id='password'
            />
            {errors?.password && <p className='login-text'>{errors.password.message}</p>}
          </div>
          <input type='submit' value='Login' />
          <Link to='/register'>
            <p className='register-link'>Dont have an account yet? Click here to register</p>
          </Link>
        </form>
      </div>
    </div>
  );
};
