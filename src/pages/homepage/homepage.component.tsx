import * as React from 'react';
import './homepage.css';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import { Preview } from '../../features/category/preview/preview.component';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchCategories } from '../../features/category/thunks';
import { fetch as fetchProducts } from '../../features/product/thunks';
import Promotions from '../../features/promotion/promotions/promotions.component';
import Main from '../../features/homepage-components/main/main.component';
import { checkIfLoading, selectPromotionItems } from '../../features/promotion/selectors';
import { fetch as fetchPromotions } from '../../features/promotion/thunks';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router';
import { selectCurrentUser, selectLoggedIn } from '../../features/user/selectors';
import { logout } from '../../features/user/thunks';
import { selectItems } from '../../features/product/selectors';
import { selectCategories } from '../../features/category/categorySlice';
import { NewReleases } from '../new_releases/new_releases.component';
import CategoryPage from '../category-page/category-page.component';
import { AuthorizationPage } from '../authorization/authorization.component';
import { AuthenticationPage } from '../authentication/authentication.component';
import { SingleProductPage } from '../single-product/single-product.component';

function Homepage(): JSX.Element {
  const dispatch = useDispatch();

  /* selectors */
  const isLoading = useSelector(checkIfLoading);
  const loggedIn = useSelector(selectLoggedIn);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectItems);
  const promotions = useSelector(selectPromotionItems);

  useEffect(() => {
    console.dir('this is match => ', match);
    /* fetch categories and products for state */
    categories.length === 0
      ? dispatch(fetchCategories())
      : products.length === 0
      ? dispatch(fetchProducts())
      : null;

    if (localStorage.getItem('user') === null && loggedIn === true) {
      dispatch(logout());
    }
  }, [dispatch]);

  if (isLoading || promotions.length === 0) {
    dispatch(fetchPromotions());
    return <p>Loading...</p>;
  }

  const currentUser = useSelector(selectCurrentUser);
  const match = useRouteMatch();

  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <Switch>
          <Route exact path='/'>
            <Preview />
            <Promotions promotions={promotions} />
          </Route>
          <Route path='/new' component={NewReleases} />
          <Route exact path={`${match.path}books/:categoryId`} component={CategoryPage} />
          <Route path='/books/:categoryId/:productId' component={SingleProductPage} />
        </Switch>
      </Main>
      <Footer />
    </div>
  );
}

export default Homepage;
