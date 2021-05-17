import * as React from 'react';
import './classics.css';
import Alert from '../../components/alert/alert.component';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchAll, fetch as fetchOrders } from '../../redux/order/orderSlice';
import { UserViewer } from '../../components/user-viewer/user-viewer.component';
import { fetch as fetchCategories, update } from '../../redux/category/categorySlice';
//import { fetch } from '../../redux/promotions/promotions.actions';
import { getProducts } from '../../services/product.service';
import PromotionCard from '../../components/promotion-card/promotion-card.component';
import { PreviewCategory } from '../../components/preview-category/preview-category.component';
import Promotions from '../../components/promotions/promotions.component';
import { SingleProductPage } from '../single-product/single-product.component';

interface IClassics {
  message: string;
}

const Classics = ({ message }: IClassics) => {
  const dispatch = useDispatch();
  return (
    <div className='classics'>
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
      <button className='cl-btn' onClick={() => dispatch(fetchAll())}>
        Test all orders
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchCategories())}>
        Fetch categories
      </button>
      <button
        className='cl-btn'
        onClick={() => dispatch(update('2c21c28b-cbbe-4c95-bda7-97feac2790ac', 'something'))}
      >
        Update category
      </button>
      <button className='cl-btn' onClick={() => console.log(dispatch(fetch()))}>
        Get products
      </button>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
