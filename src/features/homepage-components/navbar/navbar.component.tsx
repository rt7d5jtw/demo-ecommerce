import * as React from 'react';
import './navbar.css';
import { Logo } from '../logo/logo.component';
import { Search } from '../search/search.component';
import ProfileLink from '../../user/profile-link/profile-link.component';
import Cart from '../../cart/cart/cart.component';

export const Navbar = (): JSX.Element => {
  return (
    <nav className='navbar'>
      <div className='nav-wrapper'>
        <Logo />
        <Search />
        <ProfileLink />
        <Cart />
      </div>
    </nav>
  );
};
