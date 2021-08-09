import * as React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import './admin-dropdown.css';

export function AdminDropdown(): JSX.Element {
  const { url } = useRouteMatch();
  return (
    <nav className='admin-dropdown'>
      <ul>
        <li>
          <Link to={`${url}/products-dashboard`}>Product</Link>
        </li>
        <li>
          <Link to={`${url}/categories-dashboard`}>Categories</Link>
        </li>
        <li>
          <Link to={`${url}/promotions-dashboard`}>Promotions</Link>
        </li>
        <li>
          <Link to={`${url}/orders-dashboard`}>Orders</Link>
        </li>
        <li>
          <Link to={`${url}/users-dashboard`}>Users</Link>
        </li>
      </ul>
    </nav>
  );
}
