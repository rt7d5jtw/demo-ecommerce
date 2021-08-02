import * as React from 'react';
import './order-card.css';
import img from '../../../assets/bar.jpg';
import { useSelector } from 'react-redux';
import { selectOrders, selectRecentOrderItems } from '../selectors';
import { CheckoutItem } from '../../../pages/checkout-item/checkout-item.component';

interface IOrderCard {
  id: string;
  date: string;
}

export const OrderCard = ({ id, date }: IOrderCard): JSX.Element => {
  const orders = useSelector(selectOrders);
  const orderItems = useSelector(selectRecentOrderItems);
  const [view, setView] = React.useState<boolean>(false);

  function ShowOrder(): JSX.Element {
    return (
      <div
        style={view ? { display: 'block' } : {}}
        className='show-order'
        onClick={() => setView(!view)}
      >
        {orderItems &&
          orderItems.map((order) => (
            <div className='show-order__row'>
              <CheckoutItem
                key={order.productId}
                productId={order.productId}
                title={order.title}
                price={order.price}
                quantity={order.quantity}
                image={order.image}
              />
            </div>
          ))}
        <div className='show-order__info'></div>
      </div>
    );
  }
  return (
    <>
      {!view ? (
        <div className='order'>
          <div className='order-info'>
            <h1 className='order-number'>Order number: {id}</h1>
            <h1 className='order-date'>Order date: {date}</h1>
          </div>
          {/* preview the first three unique items from the cart */}
          <div className='order-container'>
            <div className='view-order' onClick={() => setView(!view)}>
              View the order
            </div>
            <ShowOrder />
          </div>
        </div>
      ) : (
        <ShowOrder />
      )}
    </>
  );
};
