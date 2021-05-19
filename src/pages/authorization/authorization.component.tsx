import * as React from 'react';
import { Register } from '../../features/user/register/register.component';
import './authorization.css';

export const AuthorizationPage = (): JSX.Element => {
  return (
    <div className='authorization'>
      <Register />
    </div>
  );
};
