import * as React from 'react';
import './profile-link.css';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { selectCurrentUser, selectLoggedIn, selectRole } from '../userSlice';
import { RootState } from '../../../app/store';
import { UserRole, logout, AccessTokenDTO } from '../userSlice';
import { createStructuredSelector } from 'reselect';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { CgProfile } from 'react-icons/cg';

type ProfileLinkProp = {
  currentUser: AccessTokenDTO | null;
  loggedIn: boolean;
  role: UserRole;
};

const ProfileLink = ({ currentUser, loggedIn }: ProfileLinkProp) => {
  return <div className='profile'>{currentUser && loggedIn ? <LoggedIn /> : <Login />}</div>;
};

export const Login = (): JSX.Element => {
  return (
    <div className='login__link'>
      <Link className='link-wrapper' to='/login'>
        <h1>Login</h1>
      </Link>
    </div>
  );
};

export const LoggedIn = (): JSX.Element => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: Event) => {
    if (
      menuRef.current &&
      menuRef2.current &&
      !menuRef2.current.contains(event.target as Node) &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.addEventListener('click', handleClickOutside, true);
    };
  }, []);

  function DropdownMenu() {
    function DropdownItem() {
      const Userole = useSelector(selectRole);
      return (
        <a href='#' className='dropdown-item'>
          <span className='span-button' onClick={() => push('/profile')}>
            Profile
          </span>
          {Userole == 'ADMIN' ? (
            <span className='span-button' onClick={() => push('/admin-page')}>
              Admin
            </span>
          ) : null}
          <span className='span-button' onClick={() => dispatch(logout())}>
            Logout
          </span>
        </a>
      );
    }
    return (
      <div className='dropdown' ref={menuRef}>
        <DropdownItem />
      </div>
    );
  }

  return (
    <div className='nav'>
      <div className='menu' ref={menuRef2}>
        <li className='nav-item'>
          <a href='#' className='icon-button' onClick={() => setOpen(!open)}>
            <CgProfile />
          </a>
          {open ? <DropdownMenu /> : null}
        </li>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, ProfileLinkProp>({
  currentUser: selectCurrentUser,
  loggedIn: selectLoggedIn,
  role: selectRole,
});

export default connect(mapStateToProps)(ProfileLink);
