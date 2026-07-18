import * as React from 'react';
import './profile-dashboard.css';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

const MyOrders = React.lazy(
  () => import('./profile-components/my-orders/my-orders.component')
);
const ChangeEmail = React.lazy(
  () => import('./profile-components/change-email/change-email.component')
);
const ChangePassword = React.lazy(
  () => import('./profile-components/change-password/change-password.component')
);
const ProfileOverview = React.lazy(
  () =>
    import('./profile-components/profile-overview/profile-overview.component')
);

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
        <div className='profile-main__wrapper'>
          <Switch>
            <Route exact path={`${match.url}`} component={ProfileOverview} />
            <Route exact path={`${match.url}/my-orders`} component={MyOrders} />
            <Route
              exact
              path={`${match.url}/change-password`}
              component={ChangePassword}
            />
            <Route
              exact
              path={`${match.url}/change-email`}
              component={ChangeEmail}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;
