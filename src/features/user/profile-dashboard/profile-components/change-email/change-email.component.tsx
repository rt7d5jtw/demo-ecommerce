import * as React from 'react';
import { useDispatch } from 'react-redux';
import { changeEmail } from '../../../thunks';
import Alert from '../../../../alert/alert/alert.component';
import { ProfileForm } from '../../../../forms/profile-form/profile-form.component';
import { handleForm } from '../../../../forms/utils/utils';

const ChangeEmail = (): JSX.Element => {
  const dispatch = useDispatch();
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(handleForm(event.currentTarget.elements));
    //dispatch(changeEmail(handleForm(event.currentTarget.elements)));
  }
  return (
    <div className='profile-overview'>
      <Alert />
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
    </div>
  );
};

export default ChangeEmail;
