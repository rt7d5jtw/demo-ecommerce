import * as React from 'react';
import './admin-creator-page.css';
import CreatorHeader from '../../components/admin-creator/creator-header/creator-header.component';
import CreatorSidebar from '../../components/admin-creator/creator-sidebar/creator-sidebar.component';
import CreatorMain from '../../components/admin-creator/creator-main/creator-main.component';
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import ProductsCreate from './products/products-create.component';
import CategoryCreate from './categories/category-create.component';
import { CreatorOverview } from './overview/creator-overview.component';
import { CategoryDelete } from './categories/category-delete.component';
import ProductsDelete from './products/products-delete.component';
import { CategoryEdit } from './categories/category-edit.component';
import ProductsEdit from './products/products-edit.component';
import PromotionsAdd from './promotions/add-promotions.component';

function AdminCreatorPage(): JSX.Element {
  const { path } = useRouteMatch();
  return (
    <div className='admin-creator'>
      <CreatorHeader />
      <CreatorSidebar />
      <CreatorMain>
        <Switch>
          <Route path={`${path}/:creatorPage`}>
            <ConditionalPaging />
          </Route>
        </Switch>
      </CreatorMain>
    </div>
  );
}

export default AdminCreatorPage;

export function ConditionalPaging(): JSX.Element {
  const { creatorPage } = useParams<{ creatorPage?: string }>();
  const matchCreator = (param: string | undefined) => {
    switch (param) {
      case 'create-products':
        return <ProductsCreate />;
      case 'delete-products':
        return <ProductsDelete />;
      case 'edit-products':
        return <ProductsEdit />;
      case 'create-categories':
        return <CategoryCreate />;
      case 'delete-categories':
        return <CategoryDelete />;
      case 'edit-categories':
        return <CategoryEdit />;
      case 'add-promotions':
        return <PromotionsAdd />;
      default:
        return <CreatorOverview />;
    }
  };
  return <>{matchCreator(creatorPage)}</>;
}
