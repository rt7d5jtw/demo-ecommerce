import * as React from 'react';
import './login.css';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../../redux/user/user.actions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { userLogged } from '../../redux/alert/alertSlice';

type FormValues = {
  email: string;
  password: string;
};

export const Login = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    push('/');
    dispatch(loginRequest(data));
    dispatch(userLogged());
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
            {...register('email', { required: true })}
            id='email'
          />
          {errors?.email && <p className='register-text'>{errors.email.message}</p>}
          <div>
            <label>Password</label>
            <input
              type='password'
              placeholder='Password'
              {...register('password', { required: true })}
              id='password'
            />
            {errors?.password && <p className='register-text'>{errors.password.message}</p>}
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
