import * as React from 'react';
import './admin-dashboard.css';
import { Link, useRouteMatch, withRouter } from 'react-router-dom';
import { AdminOverview } from './admin-components/admin-overview/admin-overview.component';
import ViewOrders from './admin-components/view-orders/view-orders.component';
import { ViewUsers } from './admin-components/view-users/view-users.component';

const AdminDashboard = () => {
  const match = useRouteMatch();
  return (
    <div className='admin-dashboard'>
      <div className='admin-dashboard__header'>
        <Link to='/'>
          <h1 className='admin-dashboard__header__store-name'> &larr; Chocolatiste</h1>
        </Link>
        <h1>Administration</h1>
      </div>
      <div className='admin-dashboard__nav'>
        <div className='admin-dashboard__nav__wrapper'>
          <Link to={`${match.url}/admin-overview`}>Admin Overview</Link>
          <Link to='/admin-creator/a' title='Create categories and products'>
            Admin Creator
          </Link>
          <Link to={`${match.url}/orders`} title='View all orders made by users'>
            View orders
          </Link>
          <Link to={`${match.url}/users`} title='View all users'>
            View users
          </Link>
        </div>
      </div>
      <div className='admin-main'>
        <ConditionalPaging />
      </div>
    </div>
  );
};

function ConditionalPaging() {
  switch (location.pathname) {
    case '/admin-page':
      return <AdminOverview />;
    case '/admin-page/users':
      return <ViewUsers />;
    case '/admin-page/orders':
      return <ViewOrders />;
    default:
      return <AdminOverview />;
  }
}

export default withRouter(AdminDashboard);
