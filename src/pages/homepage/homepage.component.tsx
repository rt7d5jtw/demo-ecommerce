import * as React from 'react';
import './homepage.css';
import { Navbar } from '../../components/navbar/navbar.component';
import { Preview } from '../../components/preview/preview.component';
import { Footer } from '../../components/footer/footer.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import Alert from '../../components/alert/alert.component';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/category/category.actions';
import Promotions from '../../components/promotions/promotions.component';
import Main from '../main/main.component';

function Homepage(): JSX.Element {
  const dispatch = useDispatch();
  useEffect(() => {
    /* fetch categories and products for state */
    dispatch(fetchCategories());
  }, [dispatch]);
  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <h1>something</h1>
      </Main>
      <Footer />
    </div>
  );
}

export default Homepage;
