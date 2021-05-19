import * as React from 'react';
import './profile.css';
import { withRouter } from 'react-router-dom';
import { ProfileHeader } from './profile-header/profile-header.component';
import ProfileMain from './profile-main/profile-main.component';
import ProfileNav from './profile-nav/profile-nav.component';
import { ProfileOverview } from './profile-components/profile-overview/profile-overview.component';
import { MyOrders } from './profile-components/my-orders/my-orders.component';
import ChangePassword from './profile-components/change-password/change-password.component';
import ChangeEmail from './profile-components/change-email/change-email.component';

const Profile = () => {
  return (
    <div className='profile-page'>
      <div className='profile-information'>
        <ProfileHeader />
        <ProfileNav />
        <ProfileMain>
          <ConditionalPaging />
        </ProfileMain>
      </div>
    </div>
  );
};

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

export default withRouter(Profile);
