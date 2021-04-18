import * as React from 'react';
import './authentication.css';
import { Login } from '../../components/login/login.component';
import Alert from '../../components/alert/alert.component';

export const AuthenticationPage = () => {
  return (
    <div className='authentication'>
      <Alert />
      <Login />
    </div>
  );
}
