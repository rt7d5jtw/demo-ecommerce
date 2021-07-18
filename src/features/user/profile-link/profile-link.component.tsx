import * as React from 'react';
import './profile-link.css';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { selectCurrentUser, selectLoggedIn, selectRole } from '../selectors';
import { RootState } from '../../../app/store';
import { UserRole, AccessTokenDTO } from '../userSlice';
import { logout } from '../thunks';
import { createStructuredSelector } from 'reselect';
import { useDispatch } from 'react-redux';
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
        <LoggedIn />
      </Link>
    </div>
  );
};

export const LoggedIn = (): JSX.Element => {
  const dispatch = useDispatch();
  const { push } = useHistory();

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
      <div className='dropdown'>
        <DropdownItem />
      </div>
    );
  }

  return (
    <div className='nav'>
      <div className='menu'>
        <li className='nav-item'>
          <a href='#' className='icon-button'>
            <CgProfile />
            <DropdownMenu />
          </a>
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
