import * as React from 'react';
import './register.css';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../../redux/user/user.actions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { registered } from '../../redux/alert/alertSlice';

export const Register = (): JSX.Element => {
  const { push } = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    //push('/login');
    dispatch(registerRequest(data));
    dispatch(registered());
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
          </div>
          <input type='submit' value='Register' />
        </form>
      </div>
    </div>
  );
};
