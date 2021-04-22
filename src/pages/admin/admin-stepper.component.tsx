import * as React from 'react';
import './admin-stepper.css';
import { Link, useLocation } from 'react-router-dom';

export const Stepper = () => {
  const location = useLocation();
  return (
    <>
    <nav className='stepper'>
      <ul className='steps'>
        <li className={location.pathname === '/category-delete' ? 'active' : ''}>
          <Link to='/category-delete'>Delete</Link>
        </li>
        <li className={location.pathname === '/category-create' ? 'active' : ''}>
          <Link to='/category-create'>Create</Link>
        </li>
        <li className={location.pathname === '/category-edit' ? 'active' : ''}>
          <Link to='/category-edit'>Edit</Link>
        </li>
      </ul>
    </nav>
    </>
  );
}
