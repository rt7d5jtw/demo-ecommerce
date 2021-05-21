import * as React from 'react';
import './homepage.css';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import { Preview } from '../../features/category/preview/preview.component';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchCategories } from '../../features/category/categorySlice';
import { fetch } from '../../features/product/productSlice';
import Promotions from '../../features/promotion/promotions/promotions.component';
import Main from '../../features/homepage-components/main/main.component';
//import { fetch as pfetch } from '../../redux/promotions/promotions.actions';
import {
  checkIfLoading,
  fetchPromotions,
  selectPromotionItems,
} from '../../features/promotion/promotionSlice';
import { Route, Switch } from 'react-router';

function Homepage(): JSX.Element {
  const dispatch = useDispatch();
  const isLoading = useSelector(checkIfLoading);
  const promotions = useSelector(selectPromotionItems);
  useEffect(() => {
    /* fetch categories and products for state */
    dispatch(fetchCategories());
    dispatch(fetch());
    dispatch(fetchPromotions());
  }, [dispatch]);

  if (isLoading) {
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
