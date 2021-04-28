import * as React from 'react';
import './admin-page.css';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { ViewUsers } from '../../components/admin/admin-components/view-users/view-users.component';
import ViewOrders from '../../components/admin/admin-components/view-orders/view-orders.component';
import { AdminOverview } from '../../components/admin/admin-components/admin-overview/admin-overview.component';
import Admin from '../../components/admin/admin.component';

interface MatchParams {
  name: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}

type IAdminPage = {
} & RouteComponentProps

const AdminPage = ({ match }: IAdminPage) => {
  return (
    <div className='admin-page'>
      <Switch>
        <Route path={`${match.path}`} component={Admin} />
        <Route path={`${match.path}/users`} component={ViewUsers} />
        <Route path={`${match.path}/admin-overview`} component={AdminOverview} />
        <Route path={`${match.path}/orders`} component={ViewOrders} />
      </Switch>
    </div>
  );
}

export default withRouter(AdminPage);
