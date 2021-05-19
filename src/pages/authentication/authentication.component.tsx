import * as React from 'react';
import './authentication.css';
import { Login } from '../../features/user/login/login.component';
import Alert from '../../features/alert/alert/alert.component';

export const AuthenticationPage = (): JSX.Element => {
  return (
    <div className='authentication'>
      <Alert />
      <Login />
    </div>
  );
};
