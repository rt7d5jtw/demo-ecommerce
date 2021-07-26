import * as React from 'react';
import './navbar.css';
import { Logo } from '../logo/logo.component';
import ProfileLink from '../../user/profile-link/profile-link.component';
import CartContainer from '../../cart/cart-container/cart-container.component';
import { Search } from '../search/search.component';

export const Navbar = (): JSX.Element => {
  const [scrollDir, setScrollDir] = React.useState(false);
  React.useEffect(() => {
    const threshold = 150;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? true : false);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDir]);

  return (
    <nav className='navbar'>
      <div className='nav-wrapper'>
        <div />
        <div className='nav-wrapper__right'>
          <Search scrollEvent={scrollDir} />
        </div>
        <div className='nav-wrapper__middle'>
          <Logo scrollEvent={scrollDir} />
        </div>
        <div />
        <div className='nav-wrapper__left'>
          <ProfileLink />
          <CartContainer />
        </div>
      </div>
    </nav>
  );
};
