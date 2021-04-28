import * as React from 'react';
import './admin.css';
import { withRouter } from 'react-router-dom';
import { AdminMain } from './admin-main/admin-main.component';
import { AdminHeader } from './admin-header/admin-header.component';
import AdminNav from './admin-nav/admin-nav.component';
import { AdminOverview } from './admin-components/admin-overview/admin-overview.component';
import ViewOrders from './admin-components/view-orders/view-orders.component';
import { ViewUsers } from './admin-components/view-users/view-users.component';

const Admin = () => {
  return (
    <div className='admin'>
      <div className='admin-information'>
        <AdminHeader />
        <AdminNav />
        <AdminMain>
          <ConditionalPaging />
        </AdminMain>
      </div>
    </div>
  );
}

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

export default withRouter(Admin);

