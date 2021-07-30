import * as React from 'react';
import './admin-controls.css';
import { useRouteMatch, Link } from 'react-router-dom';
import PromotionsDelete from './components/promotions/delete-promotions.component';
import PromotionsEdit from './components/promotions/edit-promotions.component';
import PromotionsAdd from './components/promotions/add-promotions.component';
import ProductsEdit from './components/products/products-edit.component';
import { CategoryEdit } from './components/categories/category-edit.component';
import ProductsDelete from './components/products/products-delete.component';
import { CategoryDelete } from './components/categories/category-delete.component';
import CategoryCreate from './components/categories/category-create.component';
import { ControlsOverview } from './components/overview/creator-overview.component';
import ProductsCreate from './components/products/products-create.component';

function AdminControls(): JSX.Element {
  const match = useRouteMatch();
  function ConditionalPaging(): JSX.Element {
    switch (location.pathname) {
      case match.url:
        return <ControlsOverview />;
      case `${match.url}/create-products`:
        return <ProductsCreate />;
      case `${match.url}/delete-products`:
        return <ProductsDelete />;
      case `${match.url}/edit-products`:
        return <ProductsEdit />;
      case `${match.url}/create-categories`:
        return <CategoryCreate />;
      case `${match.url}/delete-categories`:
        return <CategoryDelete />;
      case `${match.url}/edit-categories`:
        return <CategoryEdit />;
      case `${match.url}/add-promotions`:
        return <PromotionsAdd />;
      case `${match.url}/edit-promotions`:
        return <PromotionsEdit />;
      case `${match.url}/delete-promotions`:
        return <PromotionsDelete />;
      default:
        return <ControlsOverview />;
    }
  }

  return (
    <div className='admin-controls'>
      <div className='admin-controls__header'>
        <div className='admin-controls__header__back-to'>
          <Link to='/admin-page'> &larr; Back to Admin</Link>
        </div>
        <div className='admin-controls__header__go-to'>
          <Link to='/'>Go to Store &rarr;</Link>
        </div>
      </div>
      <nav className='admin-controls__sidebar'>
        <ul>
          <li>
            <Link to={match.url + `/create-products`}>Create Products</Link>
          </li>
          <li>
            <Link to={match.url + `/delete-products`}>Delete Products</Link>
          </li>
          <li>
            <Link to={match.url + `/edit-products`}>Edit Products</Link>
          </li>
          <li>
            <Link to={match.url + `/create-categories`}>Create Categories</Link>
          </li>
          <li>
            <Link to={match.url + `/delete-categories`}>Delete Categories</Link>
          </li>
          <li>
            <Link to={match.url + `/edit-categories`}>Edit Categories</Link>
          </li>
          <li>
            <Link to={match.url + `/add-promotions`}>Add Promotion</Link>
          </li>
          <li>
            <Link to={match.url + `/edit-promotions`}>Edit Promotion</Link>
          </li>
          <li>
            <Link to={match.url + `/delete-promotions`}>Delete Promotion</Link>
          </li>
        </ul>
      </nav>
      <div className='admin-controls__main'>
        <ConditionalPaging />
      </div>
    </div>
  );
}

export default AdminControls;
