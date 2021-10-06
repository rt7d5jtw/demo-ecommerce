import * as React from 'react';
import './admin-dashboard.css';
import { useRouteMatch, Link, Switch, Route } from 'react-router-dom';

const AdminDropdown = React.lazy(() => import('../admin-dropdown/admin-dropdown.component'));
const ControlsOverview = React.lazy(
  () => import('./components/overview/creator-overview.component')
);
const Edit = React.lazy(() => import('./components/products/edit.component'));
const Create = React.lazy(() => import('./components/products/create.component'));
const CategoryEdit = React.lazy(() => import('./components/categories/category-edit.component'));
const CategoryCreate = React.lazy(
  () => import('./components/categories/category-create.component')
);
const PromotionsEdit = React.lazy(
  () => import('./components/promotions/edit-promotions.component')
);
const PromotionsAdd = React.lazy(() => import('./components/promotions/add-promotions.component'));

const UserDashboard = React.lazy(() => import('./components/users/users-dashboard.component'));
const OrdersDashboard = React.lazy(() => import('./components/orders/orders-dashboard.component'));
const ProductDashboard = React.lazy(
  () => import('./components/products/products-dashboard.component')
);
const CategoriesDashboard = React.lazy(
  () => import('./components/categories/categories-dashboard.component')
);
const PromotionsDashboard = React.lazy(
  () => import('./components/promotions/promotions-dashboard.component')
);

function AdminDashboard(): JSX.Element {
  const match = useRouteMatch();
  return (
    <div className='admin-controls'>
      <div className='admin-controls__header'>
        <div className='admin-controls__header__go-to'>
          <Link to='/'>&larr; Go to Store</Link>
        </div>
      </div>
      <nav className='admin-controls__sidebar'>
        <ul>
          <AdminDropdown />
        </ul>
      </nav>
      <div className='admin-controls__main'>
        <Switch>
          <Route exact path={`${match.url}/orders-dashboard`} component={OrdersDashboard} />
          <Route exact path={`${match.url}/users-dashboard`} component={UserDashboard} />
          <Route exact path={`${match.url}/categories-dashboard`} component={CategoriesDashboard} />
          <Route
            exact
            path={`${match.url}/categories-dashboard/categories-create`}
            component={CategoryCreate}
          />
          <Route
            exact
            path={`${match.url}/categories-dashboard/categories-edit/:id`}
            component={CategoryEdit}
          />
          <Route exact path={`${match.url}/promotions-dashboard`} component={PromotionsDashboard} />
          <Route
            exact
            path={`${match.url}/promotions-dashboard/promotions-edit/:id`}
            component={PromotionsEdit}
          />
          <Route
            exact
            path={`${match.url}/promotions-dashboard/promotions-create`}
            component={PromotionsAdd}
          />
          <Route exact path={`${match.url}/products-dashboard`} component={ProductDashboard} />
          <Route path={`${match.url}/products-dashboard/edit/:id`} component={Edit} />
          <Route exact path={`${match.url}/products-dashboard/create`} component={Create} />
          <Route path={`${match.url}`} component={ControlsOverview} />
        </Switch>
      </div>
    </div>
  );
}

export default AdminDashboard;
