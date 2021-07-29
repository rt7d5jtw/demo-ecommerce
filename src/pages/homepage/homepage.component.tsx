import * as React from 'react';
import './homepage.css';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchCategories } from '../../features/category/thunks';
import { fetch as fetchProducts } from '../../features/product/thunks';
import Main from '../../features/homepage-components/main/main.component';
import { checkIfLoading, selectPromotionItems } from '../../features/promotion/selectors';
import { fetch as fetchPromotions } from '../../features/promotion/thunks';
import { Route, Switch, useRouteMatch } from 'react-router';
import { selectLoggedIn, selectRole } from '../../features/user/selectors';
import { logout } from '../../features/user/thunks';
import { selectItems } from '../../features/product/selectors';
import { selectCategories } from '../../features/category/categorySlice';
import CategoryPage from '../category-page/category-page.component';
import { SingleProductPage } from '../single-product/single-product.component';
import { PurchaseConfirmed } from '../purchase-confirmed/purchase-confirmed';
import { StripeOrderWrapper } from '../stripe-order-wrapper/stripe-order-wrapper.component';
import Checkout from '../checkout/checkout.component';
import SearchPage from '../search-result/search-result.component';
import { NotFound } from '../404/404.component';
import Homefront from '../homefront/homefront.component';
import Homemiddle from '../home-middle/home-middle.component';
import Homebottom from '../home-bottom/home-bottom.component';
import Cart from '../cart/cart.component';

function Homepage(): JSX.Element {
  const dispatch = useDispatch();

  /* selectors */
  const isLoading = useSelector(checkIfLoading);
  const loggedIn = useSelector(selectLoggedIn);
  const role = useSelector(selectRole);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectItems);
  const promotions = useSelector(selectPromotionItems);
  console.log(role);

  categories.length === 0
    ? dispatch(fetchCategories())
    : products.length === 0
    ? dispatch(fetchProducts())
    : promotions.length === 0
    ? dispatch(fetchPromotions())
    : null;

  if (localStorage.getItem('user') === null && loggedIn === true) {
    dispatch(logout());
  }

  const match = useRouteMatch();
  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <Switch>
          <Route exact path='/'>
            <Homefront />
            <Homemiddle />
            <Homebottom />
          </Route>
          <Route exact path='/purchase-confirmed' component={PurchaseConfirmed} />
          <Route exact path='/payment' component={StripeOrderWrapper} />
          <Route path='/cart' component={Cart} />
          <Route exact path='/checkout' component={Checkout} />
          <Route exact path={`${match.path}products/:category`} component={CategoryPage} />
          <Route path='/products/:category/:productId' component={SingleProductPage} />
          <Route path='/search-result' component={SearchPage} />
          <Route path='*' component={NotFound} />
        </Switch>
      </Main>
      <Footer />
    </div>
  );
}

export default Homepage;
