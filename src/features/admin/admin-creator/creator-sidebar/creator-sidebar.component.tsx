import * as React from 'react';
import './creator-sidebar.css';
import { Link, useRouteMatch } from 'react-router-dom';

function CreatorSidebar(): JSX.Element {
  const { url } = useRouteMatch();
  return (
    <nav className='creator-sidebar'>
      <ul>
        <li>
          <Link to={url + `/create-products`}>Create Products</Link>
        </li>
        <li>
          <Link to={url + `/delete-products`}>Delete Products</Link>
        </li>
        <li>
          <Link to={url + `/edit-products`}>Edit Products</Link>
        </li>
        <li>
          <Link to={url + `/create-categories`}>Create Categories</Link>
        </li>
        <li>
          <Link to={url + `/delete-categories`}>Delete Categories</Link>
        </li>
        <li>
          <Link to={url + `/edit-categories`}>Edit Categories</Link>
        </li>
        <li>
          <Link to={url + `/add-promotions`}>Add Promotion</Link>
        </li>
        <li>
          <Link to={url + `/edit-promotions`}>Edit Promotion</Link>
        </li>
        <li>
          <Link to={url + `/delete-promotions`}>Delete Promotion</Link>
        </li>
      </ul>
    </nav>
  );
}

export default CreatorSidebar;
