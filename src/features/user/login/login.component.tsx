import * as React from 'react';
import './login.css';
import img from '../../../assets/delicious2.jpg';
import { useDispatch } from 'react-redux';
import { handleSignIn } from '../../user/thunks';
import { ProfileForm } from '../../forms/profile-form/profile-form.component';
import { handleForm } from '../../forms/utils/utils';
import { AuthOverlay } from '../auth-overlay/auth-overlay.component';

export const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(handleSignIn(handleForm(event.currentTarget.elements)));
  }
  return (
    <div className='login'>
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
                head: 'Login',
                submit: 'Login',
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
