import * as React from 'react';
import './change-password.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../../thunks';
import { useState, useEffect } from 'react';
import { selectUserErrors } from '../../../selectors';
import Alert from '../../../../alert/alert/alert.component';

type FormValues = {
  currentPassword: string;
  newPassword: string;
};

const ChangePassword = (): JSX.Element => {
  const userErrors = useSelector(selectUserErrors);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const [disable, setDisable] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setDisable(true);
    setTimeout(() => setDisable(false), 3000);
    dispatch(changePassword(data));
    if (userErrors != null && userErrors.statusCode === 401) {
      setError('newPassword', {
        type: 'manual',
        message: 'Authorization failed, try logging in again',
      });
    }
    if (userErrors != null && userErrors.statusCode === 409) {
      setError('newPassword', {
        type: 'manual',
        message: 'Validation failed, provide correct password',
      });
    }
  };

  useEffect(() => {
    if (userErrors != null && userErrors.statusCode === 401) {
      setError('newPassword', {
        type: 'manual',
        message: 'Authorization failed, try logging in again',
      });
    }
    if (userErrors != null && userErrors.statusCode === 409) {
      setError('newPassword', {
        type: 'manual',
        message: 'Validation failed, provide correct password',
      });
    }
  }, [userErrors]);

  return (
    <div className='profile-overview'>
      <Alert />
      <div className='profile-details-wrapper'>
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
            <input disabled={disable} type='submit' value='Save Password' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
