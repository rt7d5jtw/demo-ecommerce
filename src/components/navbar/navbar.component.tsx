import * as React from 'react';
import './navbar.css';
import { Logo } from '../logo/logo.component';
import { Search } from '../search/search.component';
import ProfileLink from '../profile-link/profile-link.component';
import Cart from '../cart/cart.component';

export const Navbar = (): JSX.Element => {
  return (
    <nav className='navbar'>
      <Logo />
      <Search />
      <ProfileLink />
      <Cart />
    </nav>
  );
};
