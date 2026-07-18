import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../../thunks';
import { ProfileForm } from '../../../../forms/profile-form/profile-form.component';
import { handleForm } from '../../../../forms/utils/utils';
import { selectUserErrors } from '../../../selectors';
import { PasswordObj } from '../../../userSlice';

const ChangePassword = (): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(selectUserErrors);
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(
      changePassword(handleForm(event.currentTarget.elements) as PasswordObj)
    );
  }
  return (
    <div className='profile-changeform'>
      <ProfileForm
        onSubmit={onSubmit}
        fields={{
          inputs: {
            inputy: {
              type: 'password',
              name: 'newPassword',
              pattern: new RegExp(/(?=.*[A-Za-z])[A-Za-z\d!]{6,}/)
                .toString()
                .slice(1, -1),
              required: true,
              title: 'Provide a password with at least 6 characters',
              minLength: 6,
              maxLength: 128,
              id: 'newPassword',
              placeholder: 'New Password',
            },
            inputx: {
              type: 'password',
              name: 'currentPassword',
              id: 'currentPassword',
              placeholder: 'Current Password',
              pattern: new RegExp(/(?=.*[A-Za-z])[A-Za-z\d!]{6,}/)
                .toString()
                .slice(1, -1),
              required: true,
              title: 'Provide a password with at least 6 characters',
              minLength: 6,
              maxLength: 128,
            },
          },
          labels: {
            head: 'Change Password',
            submit: 'Submit',
            labelx: 'Current Password',
            labely: 'New Password',
          },
        }}
      />
      <p className='profile-warnings'>
        {errors && (errors as { statusCode: number })?.statusCode === 401
          ? 'Invalid credentials!'
          : null}
      </p>
    </div>
  );
};

export default ChangePassword;
