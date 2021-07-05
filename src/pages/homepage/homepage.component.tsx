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
import { Route, Switch } from 'react-router';
import { selectLoggedIn } from '../../features/user/selectors';
import { logout } from '../../features/user/thunks';
import { selectItems } from '../../features/product/selectors';
import { selectCategories } from '../../features/category/categorySlice';

function Homepage(): JSX.Element {
  const dispatch = useDispatch();

  /* selectors */
  const isLoading = useSelector(checkIfLoading);
  const loggedIn = useSelector(selectLoggedIn);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectItems);
  const promotions = useSelector(selectPromotionItems);

  useEffect(() => {
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

  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <Switch>
          <Route path='/'>
            <Preview />
            <Promotions promotions={promotions} />
          </Route>
        </Switch>
      </Main>
      <Footer />
    </div>
  );
}

export default Homepage;
