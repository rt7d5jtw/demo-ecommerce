import * as React from 'react';
import './change-email.css';
import { useDispatch, useSelector } from 'react-redux';
import { changeEmail } from '../../../thunks';
import { ProfileForm } from '../../../../forms/profile-form/profile-form.component';
import { handleForm } from '../../../../forms/utils/utils';
import { selectUserErrors } from '../../../selectors';

const ChangeEmail = (): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(selectUserErrors);
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(changeEmail(handleForm(event.currentTarget.elements)));
  }
  return (
    <div className='profile-changeform'>
      <ProfileForm
        onSubmit={onSubmit}
        fields={{
          inputs: {
            inputx: {
              type: 'email',
              name: 'currentEmail',
              pattern: new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
                .toString()
                .slice(1, -1),
              required: true,
              title: 'Provide a proper email',
              minLength: 3,
              maxLength: 256,
              id: 'currentEmail',
              placeholder: 'Current Email',
            },
            inputy: {
              type: 'email',
              name: 'newEmail',
              id: 'newEmail',
              placeholder: 'New Email',
              pattern: new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
                .toString()
                .slice(1, -1),
              required: true,
              title: 'Provide a proper email',
              minLength: 3,
              maxLength: 256,
            },
          },
          labels: {
            head: 'Change Email',
            submit: 'Submit',
            labelx: 'Current Email',
            labely: 'New Email',
          },
        }}
      />
      <p className='profile-warnings'>
        {errors && errors?.statusCode === 401 ? 'Invalid credentials!' : null}
      </p>
    </div>
  );
};

export default ChangeEmail;
