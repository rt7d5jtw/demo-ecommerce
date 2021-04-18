import * as React from 'react';
import './order-card.css';

interface IOrderCard {
  ordernum: string;
  date: string;
  image: string;
  title: string;
}

interface IOrderImage {
  image: string;
  title: string;
}

export const OrderCard = ({ image, title, ordernum, date }: IOrderCard) => {

  function OrderImage({ image, title }: IOrderImage) {
    return (
      <div className='order-card'>
        <div className='image' style={{backgroundImage: `url(${image})`}}>
        </div>
        <span className='order-title'>{title}</span>
      </div>
    );
  }


  return (
      <>
      <div className='order'>
        <div className='order-info'>
          <h1 className='order-number'>Order number: {ordernum}</h1>
          <h1 className='order-date'>Order date: {date}</h1>
        </div>
        {/* preview the first three unique items from the cart */}
        <div className='order-container'>
          <OrderImage image={image} title={title}/>
          <OrderImage image={image} title={title}/>
          <OrderImage image={image} title={title}/>
          <div className='view-order'>
            View the order
          </div>
        </div>
      </div>
      </>
  );
}
