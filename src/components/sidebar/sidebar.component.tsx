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
        <Link to='/Scifi' href='scifi'>Science Fiction</Link>
        <Link to='/Fantasy' href='fantasy'>Fantasy</Link>
        <Link to='/Humor' href='humor'>Humor</Link>
        <Link to='/Romance' href='romance'>Romance</Link>
        <Link to='/Mystery' href='mystery'>Mystery &amp; Thriller</Link>
        <Link to='/Poetry' href='poetry'>Poetry &amp; Drama</Link>
        <Link to='/Histfic' href='histfic'>Historical Fiction</Link>
        <Link to='/Biography' href='biography'>Biography</Link>
    </div>
  )
}
