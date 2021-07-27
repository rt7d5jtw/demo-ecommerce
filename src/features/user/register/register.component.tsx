import * as React from 'react';
import './register.css';
import { useDispatch } from 'react-redux';
import { registerRequest } from '../thunks';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import image from '../../../assets/bee.jpg';

type FormValues = {
  email: string;
  password: string;
};

export const Register = (): JSX.Element => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(registerRequest(data));
    push('/login');
  };
  return (
    <div className='register'>
      <img className='register__picture' src={image} />
      <div className='register__wrapper'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            type='email'
            placeholder='Email'
            {...register('email', { required: true })}
            id='email'
          />
          {errors?.email && <p className='warning-text'>{errors.email.message}</p>}
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
              id='password'
            />
            {errors?.password && <p className='warning-text'>{errors.password.message}</p>}
          </div>
          <input type='submit' value='Register' />
        </form>
      </div>
    </div>
  );
};
