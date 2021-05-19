import * as React from 'react';
import './profile-page.css';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import ChangeEmail from '../../features/user/profile-dashboard/profile-components/change-email/change-email.component';
import ChangePassword from '../../features/user/profile-dashboard/profile-components/change-password/change-password.component';
import { MyOrders } from '../../features/user/profile-dashboard/profile-components/my-orders/my-orders.component';
import ProfileDashboard from '../../features/user/profile-dashboard/profile-dashboard.component';

type IProfilePage = RouteComponentProps;

const ProfilePage = ({ match }: IProfilePage) => {
  return (
    <div className='profile-page'>
      <Switch>
        <Route path={`${match.path}`} component={ProfileDashboard} />
        <Route path={`${match.path}/my-orders`} component={MyOrders} />
        <Route path={`${match.path}/change-password`} component={ChangePassword} />
        <Route path={`${match.path}/change-email`} component={ChangeEmail} />
      </Switch>
    </div>
  );
};
export default withRouter(ProfilePage);
