import * as React from 'react';
import './register.css';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../../redux/user/user.actions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { userRegistered } from '../../redux/alert/alert.actions';

type FormValues = {
  email: string;
  password: string;
  confirm_password: string;
};

export const Register = (): JSX.Element => {
  const { push } = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    push('/login');
    dispatch(registerRequest(data));
    dispatch(userRegistered());
  };

  const { requesting } = useSelector((state: any) => state.user.requesting);
  const dispatch = useDispatch();

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
            <label>Confirm Password</label>
            <input
              type='password'
              {...register('confirm_password', {
                validate: (value) => value === watch('password') || "Passwords don't match",
              })}
              placeholder='Confirm Password'
              required
            />
          </div>
          {errors?.confirm_password && (
            <p className='register-text'>{errors.confirm_password.message}</p>
          )}

          <input type='submit' value='Register' />
        </form>
      </div>
    </div>
  );
};
