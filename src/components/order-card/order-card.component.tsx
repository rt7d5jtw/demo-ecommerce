import * as React from 'react';
import './order-card.css';

interface IOrderCard {
  id: string;
  date: any;
}

interface IOrderImage {}

export const OrderCard = ({ id, date }: IOrderCard) => {
  function OrderImage({}: IOrderImage) {
    return (
      <div className='order-card'>
        <div className='image' style={{ backgroundImage: `url()` }}></div>
        <span className='order-title'>{}</span>
      </div>
    );
  }

  return (
    <>
      <div className='order'>
        <div className='order-info'>
          <h1 className='order-number'>Order number: {id}</h1>
          <h1 className='order-date'>Order date: {date}</h1>
        </div>
        {/* preview the first three unique items from the cart */}
        <div className='order-container'>
          <div className='view-order'>View the order</div>
        </div>
      </div>
    </>
  );
};
