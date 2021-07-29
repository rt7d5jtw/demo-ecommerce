import * as React from 'react';
import './change-password.css';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../../thunks';
import Alert from '../../../../alert/alert/alert.component';
import { ProfileForm } from '../../../../forms/profile-form/profile-form.component';
import { handleForm } from '../../../../forms/utils/utils';

const ChangePassword = (): JSX.Element => {
  const dispatch = useDispatch();
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(changePassword(handleForm(event.currentTarget.elements)));
  }
  return (
    <div className='profile-overview'>
      <Alert />
      <ProfileForm
        onSubmit={onSubmit}
        fields={{
          inputs: {
            inputy: {
              type: 'password',
              name: 'newPassword',
              pattern: new RegExp(/(?=.*[A-Za-z])[A-Za-z\d!]{6,}/).toString().slice(1, -1),
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
              pattern: new RegExp(/(?=.*[A-Za-z])[A-Za-z\d!]{6,}/).toString().slice(1, -1),
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
    </div>
  );
};

export default ChangePassword;
