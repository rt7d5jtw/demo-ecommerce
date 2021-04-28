import * as React from 'react';
import './profile-page.css'; 
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import ChangeDetails from '../../components/profile/profile-components/change-details/change-details.component';
import ChangeEmail from '../../components/profile/profile-components/change-email/change-email.component';
import ChangePassword from '../../components/profile/profile-components/change-password/change-password.component';
import { MyOrders } from '../../components/profile/profile-components/my-orders/my-orders.component';
import Profile from '../../components/profile/profile.component';

interface MatchParams {
  name: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}

type IProfilePage = {
} & RouteComponentProps


const ProfilePage = ({ match }: IProfilePage) => {
  return (
  <div className='profile-page'>
    <Switch>
      <Route path={`${match.path}`} component={Profile} />
      <Route path={`${match.path}/my-orders`} component={MyOrders} />
      <Route path={`${match.path}/change-password`} component={ChangePassword} />
      <Route path={`${match.path}/change-email`} component={ChangeEmail} />
      <Route path={`${match.path}/change-details`} component={ChangeDetails} />
    </Switch>
  </div>
  );
}
export default withRouter(ProfilePage);
