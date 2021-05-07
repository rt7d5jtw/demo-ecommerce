import * as React from 'react';
import './classics.css';
import Alert from '../../components/alert/alert.component';
import { useDispatch } from 'react-redux';
import { RootState } from '../../redux/root-reducer';
import {
  productAdded,
  productDeleted,
  cartCleared,
  userLogged,
  userRegistered,
} from '../../redux/alert/alert.actions';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectMessage } from '../../redux/alert/alert.selectors';
import { getRole, listUsers } from '../../redux/user/user.actions';
import { fetchAllOrders, fetchOrders } from '../../redux/order/order.actions';
import { UserViewer } from '../../components/user-viewer/user-viewer.component';
import { fetchCategories, updateCategory } from '../../redux/category/category.actions';
import { editCategory } from '../../services/category.service';
import { fetchProducts } from '../../redux/product/product.actions';
import { getProducts } from '../../services/product.service';
import PromotionCard from '../../components/promotion-card/promotion-card.component';
import { PreviewCategory } from '../../components/preview-category/preview-category.component';
import Promotions from '../../components/promotions/promotions.component';

interface IClassics {
  message: string;
}

const Classics = ({ message }: IClassics) => {
  const dispatch = useDispatch();

  return (
    <div className='classics'>
      <Alert />
      <button className='cl-btn' onClick={() => dispatch(productAdded())}>
        Add item
      </button>
      <button className='cl-btn' onClick={() => dispatch(productDeleted())}>
        Delete item
      </button>
      <button className='cl-btn' onClick={() => dispatch(cartCleared())}>
        Clear Cart
      </button>
      <button className='cl-btn' onClick={() => dispatch(userLogged())}>
        Log in
      </button>
      <button className='cl-btn' onClick={() => dispatch(userRegistered())}>
        Register
      </button>
      <button className='cl-btn' onClick={() => dispatch(getRole())}>
        Get Role
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchOrders())}>
        Get Orders
      </button>
      <button className='cl-btn' onClick={() => dispatch(listUsers())}>
        Test users
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchAllOrders())}>
        Test all orders
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchCategories())}>
        Test all categories
      </button>
      <button
        className='cl-btn'
        onClick={() =>
          dispatch(updateCategory('2c21c28b-cbbe-4c95-bda7-97feac2790ac', 'something'))
        }
      >
        Update category
      </button>
      <button className='cl-btn' onClick={() => console.log(fetchProducts())}>
        Get products
      </button>

      <Promotions />
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
