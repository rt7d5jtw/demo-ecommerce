import * as React from 'react';
import './register.css';
import { useAppDispatch } from '../../../app/hooks';
import { IUserCredentials, register } from '../userSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { registered } from '../../alert/alertSlice';

type FormValues = {
  email: string;
  password: string;
};

export const Register = (): JSX.Element => {
  const { push } = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    push('/login');
    dispatch(register(data));
    dispatch(registered());
  };

  const dispatch = useAppDispatch();

  return (
    <div className='register'>
      <div
        className='register-picture'
        style={{ backgroundImage: `url('https://i.imgur.com/Esf8WO9.jpg')` }}
      ></div>
      <div className='registration-wrapper'>
        <h1>Register</h1>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            type='email'
            placeholder='Email'
            {...register('email', { required: true })}
            id='email'
            required
          />
          {errors?.email && <p className='register-text'>{errors.email.message}</p>}
          <div>
            <label>Password</label>
            <input
              type='password'
              placeholder='Password'
              {...register('password', {
                required: true,
                minLength: { value: 6, message: 'Passwords must have at least 6 characters' },
                maxLength: 150,
              })}
              required
            />
            {errors?.password && <p className='register-text'>{errors.password.message}</p>}
          </div>
          <input type='submit' value='Register' />
        </form>
      </div>
    </div>
  );
};
