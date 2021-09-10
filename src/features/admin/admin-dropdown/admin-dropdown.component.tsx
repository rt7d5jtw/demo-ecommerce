import * as React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import './admin-dropdown.css';

export function AdminDropdown(): JSX.Element {
  const { url } = useRouteMatch();
  return (
    <nav className='admin-dropdown'>
      <ul>
        <li>
          <Link to={`${url}/products-dashboard`} id='products'>
            Product
          </Link>
        </li>
        <li>
          <Link to={`${url}/categories-dashboard`} id='categories'>
            Categories
          </Link>
        </li>
        <li>
          <Link to={`${url}/promotions-dashboard`} id='promotions'>
            Promotions
          </Link>
        </li>
        <li>
          <Link to={`${url}/orders-dashboard`} id='orders'>
            Orders
          </Link>
        </li>
        <li>
          <Link to={`${url}/users-dashboard`} id='users'>
            Users
          </Link>
        </li>
      </ul>
    </nav>
  );
}
