import * as React from 'react';
import { Navbar } from '../../components/navbar/navbar.component';
import { Preview } from '../../components/preview/preview.component';
import { Footer } from '../../components/footer/footer.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import Alert from '../../components/alert/alert.component';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/category/category.actions';

function Homepage() {
  const dispatch = useDispatch();
  useEffect(() => {
    /* fetch categories and products for state */
    dispatch(fetchCategories())
  }, [dispatch])
  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Alert />
      <Preview />
      <Footer />
    </div>
  )
}

export default Homepage;
