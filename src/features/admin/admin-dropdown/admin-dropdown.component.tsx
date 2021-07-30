import * as React from 'react';
import './admin-dropdown.css';

export function AdminDropdown(): JSX.Element {
  return (
    <nav className='admin-dropdown'>
      <ul>
        <li>Products</li>
        <li>Categories</li>
        <li>Promotions</li>
      </ul>
    </nav>
  );
}
