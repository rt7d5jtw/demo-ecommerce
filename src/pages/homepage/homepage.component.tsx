import * as React from 'react';
import './homepage.css';
import { Navbar } from '../../components/navbar/navbar.component';
import { Preview } from '../../components/preview/preview.component';
import { Footer } from '../../components/footer/footer.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchCategories } from '../../redux/category/categorySlice';
import { fetch } from '../../redux/product/productSlice';
import Promotions from '../../components/promotions/promotions.component';
import Main from '../main/main.component';
//import { fetch as pfetch } from '../../redux/promotions/promotions.actions';
import {
  checkIfLoading,
  fetchPromotions,
  selectPromotions,
} from '../../redux/promotions/promotionsSlice';
import { Route, Switch } from 'react-router';
import { selectCategories } from '../../redux/category/categorySlice';

function Homepage(): JSX.Element {
  const dispatch = useDispatch();
  const isLoading = useSelector(checkIfLoading);
  const promotions = useSelector(selectPromotions);
  useEffect(() => {
    /* fetch categories and products for state */
    dispatch(fetchCategories());
    dispatch(fetch());
    dispatch(fetchPromotions());
    console.log(promotions);
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
