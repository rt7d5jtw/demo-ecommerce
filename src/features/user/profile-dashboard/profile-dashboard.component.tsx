import * as React from 'react';
import './profile-dashboard.css';
import { Link, useRouteMatch } from 'react-router-dom';
import { ProfileOverview } from './profile-components/profile-overview/profile-overview.component';
import { MyOrders } from './profile-components/my-orders/my-orders.component';
import ChangePassword from './profile-components/change-password/change-password.component';
import ChangeEmail from './profile-components/change-email/change-email.component';

function ProfileDashboard(): JSX.Element {
  const match = useRouteMatch();
  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <Link to='/'>&larr; Chocolatiste</Link>
        <h1>My Profile</h1>
      </div>
      <div className='profile-nav'>
        <div className='profile-nav-wrapper'>
          <Link to={`${match.url}/my-orders`}>My Orders</Link>
          <Link to={`${match.url}/change-password`}>Change Password</Link>
          <Link to={`${match.url}/change-email`}>Change Email</Link>
        </div>
      </div>
      <div className='profile-main'>
        <ConditionalPaging />
      </div>
    </div>
  );
}

function ConditionalPaging() {
  switch (location.pathname) {
    case '/profile':
      return <ProfileOverview />;
    case '/profile/my-orders':
      return <MyOrders />;
    case '/profile/change-password':
      return <ChangePassword />;
    case '/profile/change-email':
      return <ChangeEmail />;
    default:
      return <ProfileOverview />;
  }
}

export default ProfileDashboard;
