import * as React from 'react';
import './view-orders.css';
import { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectOrders } from '../../../../redux/order/order.selectors';
import { fetchAllOrders } from '../../../../redux/order/order.actions';
import { OrderCard } from '../../../../components/order-card/order-card.component';

const ViewOrders = () => {
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  return (
    <div className='admin-overview'>
      <div className='admin-myorders-wrapper'>
        <h1 id='browse-orders'>Browse orders</h1>
        <div className='admin-order-wrapper'>
      {orders.map(({ id, date, ...props }) => (
        <OrderCard key={id} id={id} date={date} { ...props } />
      ))}
        </div>
      </div>
    </div>

  );
}

export default ViewOrders;
