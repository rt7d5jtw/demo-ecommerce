import * as React from 'react';
import './logo.css';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <div className='logo'>
      <Link className='logo-link' to="/">
        <h1>Bookstore</h1>
      </Link>
    </div>
  );
}
