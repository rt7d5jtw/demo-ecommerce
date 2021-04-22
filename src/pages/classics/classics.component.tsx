import * as React from 'react';
import './classics.css';
import Alert from '../../components/alert/alert.component';
import { useDispatch } from 'react-redux';
import { RootState } from '../../redux/root-reducer';
import { productAdded, productDeleted, cartCleared, userLogged, userRegistered } from '../../redux/alert/alert.actions';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectMessage } from '../../redux/alert/alert.selectors';
import { OrderCard } from '../../components/order-card/order-card.component';
import { getRole, listUsers } from '../../redux/user/user.actions';
import { fetchAllOrders, fetchOrders } from '../../redux/order/order.actions';
import { getOrders } from '../../services/order.service';
import { UserViewer } from '../../components/user-viewer/user-viewer.component';
import { fetchCategories, updateCategory } from '../../redux/category/category.actions';
import { editCategory } from '../../services/category.service';

interface IClassics {
  message: string;
}

const Classics = ({ message }: IClassics) => {
  const dispatch = useDispatch();

  return (
    <div className='classics'>
      <Alert />
      <button className='cl-btn' onClick={() => dispatch(productAdded())}>Add item</button>
      <button className='cl-btn' onClick={() => dispatch(productDeleted())}>Delete item</button>
      <button className='cl-btn' onClick={() => dispatch(cartCleared())}>Clear Cart</button>
      <button className='cl-btn' onClick={() => dispatch(userLogged())}>Log in</button>
      <button className='cl-btn' onClick={() => dispatch(userRegistered())}>Register</button>
      <button className='cl-btn' onClick={() => dispatch(getRole())}>Get Role</button>
      <button className='cl-btn' onClick={() =>dispatch(fetchOrders())}>Get Orders</button>
      <button className='cl-btn' onClick={() => dispatch(listUsers())}>Test users</button>
      <button className='cl-btn' onClick={() => dispatch(fetchAllOrders())}>Test all orders</button>
      <button className='cl-btn' onClick={() => dispatch(fetchCategories())}>Test all categories</button>
      <button className='cl-btn' onClick={() => dispatch(updateCategory('2c21c28b-cbbe-4c95-bda7-97feac2790ac', 'something'))}>Update category</button>
      <button className='cl-btn' onClick={() => console.log((editCategory('2c21c28b-cbbe-4c95-bda7-97feac2790ac', { cname: 'something' })))}>Update straight category</button>

      <div className='owrapper'>
        <UserViewer email={'miumau@gmail.com'} id={'1517baeb-81d3-4462-89ab-85a017de8f99'} date={'16-4-2021'} />
      </div>

    </div>
  );
}



const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
})

export default connect(mapStateToProps)(Classics);
