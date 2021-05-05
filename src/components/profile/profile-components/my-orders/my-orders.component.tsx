import * as React from 'react';
import './my-orders.css';
import { OrderCard } from '../../../../components/order-card/order-card.component';
import { useSelector } from 'react-redux';
import { selectOrders } from '../../../../redux/order/order.selectors';

export const MyOrders = () => {
  const orders = useSelector(selectOrders);
  return (
    <div className='profile-overview'>
      <div className='profile-myorders-wrapper'>
        <h1>Browse your orders</h1>
        <div className='order-wrapper'>
          {orders.map(({ id, date, ...props }) => (
            <OrderCard key={id} id={id} date={date} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
};
