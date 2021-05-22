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
import { authHeader, CART_URL, fetchRole } from '../../features/user/userSlice';
import axios from 'axios';

interface IClassics {
  message: string;
}

const Classics = () => {
  const dispatch = useDispatch();
  return (
    <div className='classics'>
      <Alert />
      <button className='cl-btn' onClick={() => dispatch(userLogged())}>
        Log in
      </button>
      <button className='cl-btn' onClick={() => dispatch(registered())}>
        Register
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchOrders())}>
        Get Orders
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchAll())}>
        Test all orders
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchCategories())}>
        Fetch categories
      </button>
      <button className='cl-btn' onClick={() => dispatch(fetchRole())}>
        Fetch my role
      </button>
      <button className='cl-btn' onClick={() => axios.post(CART_URL, {}, { headers: authHeader() })}>
        Create a cart
      </button>
      <button className='cl-btn' onClick={() => console.log(axios.post(CART_URL + 8, { quantity: 1 }, { headers: authHeader() }))}>
        Add Item to Cart
      </button>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
