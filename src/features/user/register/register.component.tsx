import * as React from 'react';
import './register.css';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../thunks';
import { useHistory } from 'react-router-dom';
import img from '../../../assets/delicious.jpg';
import { AuthOverlay } from '../auth-overlay/auth-overlay.component';
import { ProfileForm } from '../../forms/profile-form/profile-form.component';
import { handleForm } from '../../forms/utils/utils';
import { selectUserErrors } from '../selectors';

export const Register = (): JSX.Element => {
  const errors = useSelector(selectUserErrors);
  const { push } = useHistory();
  const dispatch = useDispatch();
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(registerRequest(handleForm(event.currentTarget.elements)));
    errors === undefined ? setTimeout(() => push('login'), 500) : null;
  }
  return (
    <div className='register'>
      <AuthOverlay img={img}>
        {
          <ProfileForm
            onSubmit={onSubmit}
            fields={{
              inputs: {
                inputx: {
                  type: 'email',
                  name: 'email',
                  pattern: new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
                    .toString()
                    .slice(1, -1),
                  required: true,
                  title: 'Provide an email address',
                  minLength: 3,
                  maxLength: 256,
                  id: 'email',
                  placeholder: 'Email',
                },
                inputy: {
                  type: 'password',
                  name: 'password',
                  id: 'password',
                  placeholder: 'Password',
                  pattern: new RegExp(/(?=.*[A-Za-z])[A-Za-z\d!]{6,}/).toString().slice(1, -1),
                  required: true,
                  title: 'Provide a password with at least 6 characters',
                  minLength: 6,
                  maxLength: 128,
                },
              },
              labels: {
                head: 'Register',
                submit: 'Register',
                labelx: 'Email',
                labely: 'Password',
              },
            }}
          />
        }
      </AuthOverlay>
    </div>
  );
};
