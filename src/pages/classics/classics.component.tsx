import * as React from 'react';
import './classics.css';
import Alert from '../../features/alert/alert/alert.component';
import { useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { userLogged, registered, selectMessage } from '../../features/alert/alertSlice';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { fetchAll, fetch as fetchOrders } from '../../features/order/orderSlice';
import { UserViewer } from '../../features/admin/admin-dashboard/admin-components/user-viewer/user-viewer.component';
import { fetch as fetchCategories, update } from '../../features/category/categorySlice';
//import { fetch } from '../../redux/promotions/promotions.actions';
import { fetchRole } from '../../features/user/userSlice';

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
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
