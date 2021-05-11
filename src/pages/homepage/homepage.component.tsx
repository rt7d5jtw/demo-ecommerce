import * as React from 'react';
import './homepage.css';
import { Navbar } from '../../components/navbar/navbar.component';
import { Preview } from '../../components/preview/preview.component';
import { Footer } from '../../components/footer/footer.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import Alert from '../../components/alert/alert.component';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/category/category.actions';
import Promotions from '../../components/promotions/promotions.component';
import Main from '../main/main.component';
import { fetch } from '../../redux/product/product.actions';
import { fetch as pfetch } from '../../redux/promotions/promotions.actions';
import { selectLoading, selectPromotions, SelectTest } from '../../redux/promotions/promotions.selectors';

function Homepage(): JSX.Element {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading)
  const promotions = useSelector(SelectTest)
  useEffect(() => {
    /* fetch categories and products for state */
    dispatch(fetchCategories());
    dispatch(fetch());
    dispatch(pfetch());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <Preview />
        <Promotions promotions={promotions} />
      </Main>
      <Footer />
    </div>
  );
}

export default Homepage;
