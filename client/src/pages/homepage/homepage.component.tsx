import * as React from 'react';
import './homepage.css';
import Navbar from '../../features/homepage-components/navbar/navbar.component';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchCategories } from '../../features/category/thunks';
import { fetch as fetchProducts } from '../../features/product/thunks';
import Main from '../../features/homepage-components/main/main.component';
import { selectPromotionItems } from '../../features/promotion/selectors';
import { fetch as fetchPromotions } from '../../features/promotion/thunks';
import { Route, Switch, useRouteMatch } from 'react-router';
import {
  selectAccessToken,
  selectLoggedIn,
} from '../../features/user/selectors';
import { logout } from '../../features/user/thunks';
import { selectItems } from '../../features/product/selectors';
import { selectCategories } from '../../features/category/categorySlice';
import CategoryPage from '../category-page/category-page.component';
import SingleProductPage from '../single-product/single-product.component';
import { PurchaseConfirmed } from '../purchase-confirmed/purchase-confirmed';
import SearchPage from '../search-result/search-result.component';
import { NotFound } from '../404/404.component';
import Homefront from '../homefront/homefront.component';
import Homemiddle from '../home-middle/home-middle.component';
import Homebottom from '../home-bottom/home-bottom.component';
import Cart from '../cart/cart.component';
import { AiFillHome } from 'react-icons/ai';
import { GiShoppingBag } from 'react-icons/gi';
import { BiLogIn } from 'react-icons/bi';
import { AiOutlineShop } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { homeGuestNotification } from '../../features/alert/alertSlice';

function Homepage(): JSX.Element {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  /* selectors */
  const accessToken = useSelector(selectAccessToken);
  const loggedIn = useSelector(selectLoggedIn);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectItems);
  const promotions = useSelector(selectPromotionItems);

  React.useEffect(() => {
    if (localStorage.getItem('notif-home') !== 'visited') {
      dispatch(homeGuestNotification({ timeout: 10000 }));
      setTimeout(() => localStorage.setItem('notif-home', 'visited'), 1000 * 3);
    }
  }, [dispatch]);

  categories.length === 0
    ? dispatch(fetchCategories())
    : products.length === 0
    ? dispatch(fetchProducts())
    : promotions.length === 0
    ? dispatch(fetchPromotions())
    : null;

  if (accessToken === null && loggedIn === true) {
    dispatch(logout());
  }
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
          <Route
            exact
            path='/purchase-confirmed'
            component={PurchaseConfirmed}
          />
          <Route path='/cart' component={Cart} />
          <Route
            exact
            path={`${match.path}products/:category`}
            component={CategoryPage}
          />
          <Route
            path='/products/:category/:productId'
            component={SingleProductPage}
          />
          <Route path='/search-result' component={SearchPage} />
          <Route path='*' component={NotFound} />
        </Switch>
      </Main>
      <Footer />
      <div className='mobile-menu'>
        <Link to='/products/shopall'>
          <AiOutlineShop id='shopicon' />
        </Link>
        <Link to='/'>
          <AiFillHome id='homeicon' />
        </Link>
        <Link to='/cart'>
          <GiShoppingBag id='carticon' />
        </Link>
        <Link to={!loggedIn ? '/login' : '/profile'}>
          <BiLogIn id='login' />
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
