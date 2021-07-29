import * as React from 'react';
import './auth-overlay.css';
import { Link, useRouteMatch } from 'react-router-dom';

interface IAuthOverlay {
  img: string;
  children: React.ReactNode;
}

export function AuthOverlay({ img, children }: IAuthOverlay): JSX.Element {
  const { url } = useRouteMatch();
  return (
    <div className='auth-overlay'>
      <img src={img} />
      {children}
      {url === '/login' ? (
        <Link to='/register' className='register-link'>
          <div className='register-link__mask'>
            Dont have an account yet? Click here to register
          </div>
        </Link>
      ) : null}
    </div>
  );
}
