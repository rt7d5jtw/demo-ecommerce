import * as React from 'react';
import './admin-header.css';
import { Link } from 'react-router-dom';

export function AdminHeader() {
  return (
    <div className='admin-header'>
      <Link to='/'>
        <h1 className='store-name'> &larr; Bookstore</h1>
      </Link>
      <h1>Administration</h1>
    </div>
  );
}
