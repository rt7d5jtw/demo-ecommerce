import * as React from 'react';
import './404.css';

export function NotFound(): JSX.Element {
  return (
    <div className='not-found'>
      <div className='not-found__404'>
        <h1>404</h1>
        <p>Oops! Something is wrong.</p>
      </div>
      <a className='not-found__button' href='/'>
        <i className='icon-home'></i> Go back to homepage
      </a>
    </div>
  );
}
