import * as React from 'react';
import './profile-header.css';
import { Link } from 'react-router-dom';

export function ProfileHeader(): JSX.Element {
  return (
    <div className='profile-header'>
      <Link to='/'>
        <h1 className='store-name'> &larr; Bookstore</h1>
      </Link>
      <h1>My Profile</h1>
    </div>
  );
}
