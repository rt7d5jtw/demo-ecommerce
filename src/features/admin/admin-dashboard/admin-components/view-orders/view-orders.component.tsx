import * as React from 'react';
import './view-orders.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrders } from '../../../../order/orderSlice';
import { fetchAll } from '../../../../order/orderSlice';
import { OrderCard } from '../../../../order/order-card/order-card.component';

const ViewOrders = (): JSX.Element => {
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  return (
    <div className='admin-overview'>
      <div className='admin-myorders-wrapper'>
        <h1 id='browse-orders'>Browse orders</h1>
        <div className='admin-order-wrapper'>
          {orders.map(({ id, date, ...props }) => (
            <OrderCard key={id} id={id} date={date} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
