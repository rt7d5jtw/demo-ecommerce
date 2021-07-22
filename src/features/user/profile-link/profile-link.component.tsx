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
import { useState, useRef, useEffect } from 'react';
import DropdownMenu from '../../homepage-components/dropdown/dropdown.component';
import { ProfileDropdown } from '../../homepage-components/dropdown/profile-drop.component';

type ProfileLinkProp = {
  currentUser: AccessTokenDTO | null;
  loggedIn: boolean;
  role: UserRole;
};

const ProfileLink = ({ currentUser, loggedIn }: ProfileLinkProp) => {
  return <div className='profile'>{currentUser && loggedIn ? <ProfileDropdown /> : <Login />}</div>;
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

const mapStateToProps = createStructuredSelector<RootState, ProfileLinkProp>({
  currentUser: selectCurrentUser,
  loggedIn: selectLoggedIn,
  role: selectRole,
});

export default connect(mapStateToProps)(ProfileLink);
