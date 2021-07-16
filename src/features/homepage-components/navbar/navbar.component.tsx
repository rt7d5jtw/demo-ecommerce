import * as React from 'react';
import './navbar.css';
import { Logo } from '../logo/logo.component';
import ProfileLink from '../../user/profile-link/profile-link.component';
import CartContainer from '../../cart/cart-container/cart-container.component';

export const Navbar = (): JSX.Element => {
  return (
    <nav className='navbar'>
      <div className='nav-wrapper'>
        <div className='nav-wrapper__right'>
          <Logo />
        </div>
        <div className='nav-wrapper__left'>
          <ProfileLink />
          <CartContainer />
        </div>
      </div>
    </nav>
  );
};
