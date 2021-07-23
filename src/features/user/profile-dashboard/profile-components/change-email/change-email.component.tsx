import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { changeEmail } from '../../../thunks';
import { selectUserEmail, selectUserErrors } from '../../../selectors';
import Alert from '../../../../alert/alert/alert.component';
import { useState, useEffect } from 'react';

type FormValues = {
  currentEmail: string;
  newEmail: string;
};

const ChangeEmail = (): JSX.Element => {
  const userMail = useSelector(selectUserEmail);
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
    console.log(data);
    setDisable(true);
    setTimeout(() => setDisable(false), 3000);
    dispatch(changeEmail(data));
    if (userErrors != null && userErrors.statusCode === 409) {
      setError('newEmail', {
        type: 'manual',
        message: 'You provided email that is already in use',
      });
    }
    if (userErrors != null && userErrors.statusCode === 401) {
      setError('newEmail', {
        type: 'manual',
        message: 'Authorization failed, try logging in again',
      });
    }
  };

  useEffect(() => {
    if (userErrors != null && userErrors.statusCode === 409) {
      setError('newEmail', {
        type: 'manual',
        message: 'You provided email that is already in use',
      });
    }
    if (userErrors != null && userErrors.statusCode === 401) {
      setError('newEmail', {
        type: 'manual',
        message: 'Authorization failed, try logging in again',
      });
    }
  }, [userErrors]);

  return (
    <div className='profile-overview'>
      <Alert />
      <div className='profile-overview__wrapper'>
        <div className='profile-password'>
          <h1>Change my email</h1>
          <form className='profile-form' onSubmit={handleSubmit(onSubmit)}>
            <label>Current Email</label>
            <input
              type='email'
              placeholder='Current email'
              {...register('currentEmail', { required: true })}
              required
            />
            {errors?.currentEmail && <p className='profile-text'>{errors.currentEmail.message}</p>}
            <div>
              <label>New Email</label>
              <input
                type='email'
                placeholder='New email'
                {...register('newEmail', { required: true })}
              />
              {errors?.newEmail && <p className='profile-text'>{errors.newEmail.message}</p>}
            </div>
            <input disabled={disable} type='submit' value='Save Email' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmail;
