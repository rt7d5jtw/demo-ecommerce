import * as React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div className='sidebar'>
        <h1>Bookstore</h1>
        <Link to='/New' href='new'>New Releases</Link>
        <Link to='/Bestsellers' href='bestsellers'>Bestsellers</Link>
        <Link to='/Outlet' href='outlet'>Outlet</Link>
        <Link to='/Fiction' href='fiction'>Fiction</Link>
    </div>
  )
}
