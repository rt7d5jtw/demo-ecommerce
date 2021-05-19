import * as React from 'react';
import './admin-page.css';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { ViewUsers } from '../../features/admin/admin-dashboard/admin-components/view-users/view-users.component';
import ViewOrders from '../../features/admin/admin-dashboard/admin-components/view-orders/view-orders.component';
import { AdminOverview } from '../../features/admin/admin-dashboard/admin-components/admin-overview/admin-overview.component';
import AdminDashboard from '../../features/admin/admin-dashboard/admin-dashboard.component';

interface MatchParams {
  name: string;
}

type MatchProps = RouteComponentProps<MatchParams>;

type IAdminPage = RouteComponentProps;

const AdminPage = ({ match }: IAdminPage) => {
  return (
    <div className='admin-page'>
      <Switch>
        <Route path={`${match.path}`} component={AdminDashboard} />
        <Route path={`${match.path}/users`} component={ViewUsers} />
        <Route path={`${match.path}/admin-overview`} component={AdminOverview} />
        <Route path={`${match.path}/orders`} component={ViewOrders} />
      </Switch>
    </div>
  );
};

export default withRouter(AdminPage);
