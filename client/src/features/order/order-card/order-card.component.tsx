import * as React from 'react';
import './order-card.css';
import { useSelector } from 'react-redux';
import { selectRecentOrderItems } from '../selectors';
import { CheckoutItem } from '../../../pages/checkout-item/checkout-item.component';

interface IOrderCard {
  id: string;
  date: string;
  total_price: number;
  address: string;
  city: string;
  postalcode: string;
}

export const OrderCard = ({
  id,
  date,
  total_price,
  address,
  city,
  postalcode,
}: IOrderCard): JSX.Element => {
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
            <div className='show-order__row' key={order.productId}>
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
        <div className='show-order__row2'>
          <p>Order Date: {date}</p>
          <p>Order ID: {id}</p>
          <p>Order total: {total_price}</p>
          <hr />
          <p>Address: {address}</p>
          <p>City: {city}</p>
          <p>Postal Code: {postalcode}</p>
        </div>
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
