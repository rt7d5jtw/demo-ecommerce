import * as React from 'react';
import './change-password.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { passwordChange } from '../../../../redux/user/user.actions';

type FormValues = {
  currentPassword: string;
  newPassword: string;
};

const ChangePassword = (): JSX.Element => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(passwordChange(data));
  };

  return (
    <div className='profile-overview'>
      <div className='profile-overview-wrapper'>
        <div className='profile-password'>
          <h1>Change my password</h1>
          <form className='profile-form' onSubmit={handleSubmit(onSubmit)}>
            <label>Current Password</label>
            <input
              type='password'
              placeholder='Current password'
              {...register('currentPassword', {
                required: 'You must specify a password',
                minLength: { value: 6, message: 'Passwords must have at least 6 characters' },
                maxLength: 150,
              })}
              id='currentPassword'
              required
            />
            {errors?.currentPassword && (
              <p className='profile-text'>{errors.currentPassword.message}</p>
            )}
            <div>
              <label>New Password</label>
              <input
                type='password'
                placeholder='New password'
                {...register('newPassword', {
                  required: 'You must specify a password',
                  minLength: { value: 6, message: 'Passwords must have at least 6 characters' },
                  maxLength: 150,
                })}
                id='newPassword'
              />
              {errors?.newPassword && <p className='profile-text'>{errors.newPassword.message}</p>}
            </div>
            <input type='submit' value='Save Password' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
