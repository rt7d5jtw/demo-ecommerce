import * as React from 'react';
import './logo.css';
import { Link } from 'react-router-dom';

interface ILogo {
  scrollEvent: boolean;
}

export const Logo = ({ scrollEvent }: ILogo): JSX.Element => {
  return (
    <div className='logo' style={scrollEvent ? { transform: 'translateY(-120%)' } : {}}>
      <Link className='logo-link' to='/'>
        <h1>Chocolatiste</h1>
      </Link>
    </div>
  );
};
