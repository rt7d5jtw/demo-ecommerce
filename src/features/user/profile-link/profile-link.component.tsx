import * as React from 'react';
import './profile-link.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectCurrentUser, selectLoggedIn, selectRole } from '../selectors';
import { RootState } from '../../../app/store';
import { UserRole } from '../userSlice';
import { createStructuredSelector } from 'reselect';
import { ProfileDropdown } from '../../user/profile-drop/profile-drop.component';
import { AccessTokenDTO } from '../api';

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
