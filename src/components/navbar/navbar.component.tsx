import * as React from 'react';
import './navbar.css';
import { Logo } from '../logo/logo.component';
import { Search } from '../search/search.component';
import Profile from '../profile/profile.component';
import Cart from '../cart/cart.component';

export const Navbar = () => {
  return (
    <nav className='navbar'>
      <Logo />
      <Search />
      <Profile />
      <Cart />
    </nav>
  );
}
