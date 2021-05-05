import * as React from 'react';
import './login.css';
import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../../redux/user/user.actions';
import { Inputs } from '../register/register.component';
import { useForm, SubmitHandler } from 'react-hook-form';
import { userLogged } from '../../redux/alert/alert.actions';

export const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    push('/');

    if (user.email && user.password) {
      dispatch(loginRequest(data));
      dispatch(userLogged());
    }
  };

  const { push } = useHistory();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  return (
    <div className='login'>
      <div
        className='login-picture'
        style={{ backgroundImage: `url('https://i.imgur.com/0c2Zp0s.jpg')` }}
      ></div>
      <div className='login-wrapper'>
        <h1>Login</h1>
        <form className='form'>
          <label>Email</label>
          <input
            type='email'
            name='email'
            value={user.email}
            placeholder='Email'
            onChange={handleChange}
            ref={register({ required: 'You must specify an email' })}
            required
          />
          {errors?.email && <p className='register-text'>{errors.email.message}</p>}
          <div>
            <label>Password</label>
            <input
              type='password'
              name='password'
              value={user.password}
              placeholder='Password'
              onChange={handleChange}
              ref={register({ required: 'You must specify a password' })}
            />
            {errors?.password && <p className='register-text'>{errors.password.message}</p>}
          </div>
          <button type='button' onClick={handleSubmit(onSubmit)}>
            Login
          </button>
          <Link to='/register'>
            <p className='register-link'>Dont have an account yet? Click here to register</p>
          </Link>
        </form>
      </div>
    </div>
  );
};
