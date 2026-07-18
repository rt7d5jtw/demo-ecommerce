import * as React from 'react';
import './my-orders.css';
import { OrderCard } from '../../../../order/order-card/order-card.component';
import { useSelector } from 'react-redux';
import { selectOrders } from '../../../../order/selectors';

const MyOrders = (): JSX.Element => {
  const orders = useSelector(selectOrders);
  return (
    <div className='profile-myorders'>
      <h1 id='profile-myorders__header'>Browse your orders</h1>
      <div className='profile-myorders__order-wrapper'>
        {orders.map(({ id, date, ...props }) => (
          <OrderCard key={id} id={id} date={date} {...props} />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
