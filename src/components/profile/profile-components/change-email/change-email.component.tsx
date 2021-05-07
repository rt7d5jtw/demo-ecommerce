import * as React from 'react';
import './change-email.css';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { emailChange } from '../../../../redux/user/user.actions';

type FormValues = {
  currentEmail: string;
  newEmail: string;
};

const ChangeEmail = (): JSX.Element => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    dispatch(emailChange(data));
  };

  return (
    <div className='profile-overview'>
      <div className='profile-overview-wrapper'>
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
            <input type='submit' value='Save Email' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmail;
