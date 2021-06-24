import * as React from 'react';
import './classics.css';
import Alert from '../../features/alert/alert/alert.component';
import { useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { userLogged, registered, selectMessage } from '../../features/alert/alertSlice';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { fetchAll, fetch as fetchOrders } from '../../features/order/orderSlice';
import { fetch as fetchCategories } from '../../features/category/categorySlice';
//import { fetch } from '../../redux/promotions/promotions.actions';
import { authHeader, CART_URL, assignRole, changePassword } from '../../features/user/userSlice';
import axios from 'axios';
//import { fetchCartState } from '../../features/cart/cartSlice';
//import { fetchPromotions } from '../../features/promotion/promotionSlice';
//import { PurchaseConfirmed } from '../purchase-confirmed/purchase-confirmed';
import { register, login, updatePassword, updateEmail } from '../../features/user/api';
import { fetchCartState } from '../../features/cart/cartSlice';

interface IClassics {
  message: string;
}

const Classics = () => {
  const dispatch = useDispatch();
  return (
    <div className='classics'>
      <Alert />
      <button className='cl-btn' onClick={() => dispatch(userLogged())}>
        Log in alert
      </button>
      <button className='cl-btn' onClick={() => dispatch(registered())}>
        Register alert
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchOrders())}>
        Get Orders
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchAll())}>
        Test all orders
      </button>
      <button
        className='cl-btn'
        onClick={() =>
          console.log(updatePassword({ currentPassword: 'habbo123', newPassword: 'habbo1234' }))
        }
      >
        Fetch categories
      </button>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
