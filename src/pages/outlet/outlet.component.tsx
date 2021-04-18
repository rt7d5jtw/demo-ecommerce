import * as React from 'react';
import './outlet.css';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Footer } from '../../components/footer/footer.component';
import { Navbar } from '../../components/navbar/navbar.component';
import { Sidebar } from '../../components/sidebar/sidebar.component';
import { RootState } from '../../redux/root-reducer';
import ProductCard from '../../components/product-card/product-card.component';
import { fetchProducts } from '../../redux/product/product.actions';
import { Product } from '../../redux/types';
import Alert from '../../components/alert/alert.component';

interface IOutlet {
  products: Product[];
}

const Outlet = ({ products }: IOutlet) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className='outlet'>
      <Alert />
      <Navbar />
      <Sidebar />
      <h1 className='category__title'>Outlet</h1>
      <div className='products'>
        {products.map(({ title, price, id, image, quantity }) => (
          <ProductCard key={id} id={id} title={title} price={price} image={image} quantity={quantity} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  products: state.product.items,
  loading: state.product.loading,
  error: state.product.error
});

export default connect(mapStateToProps)(Outlet);
