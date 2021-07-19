import * as React from 'react';
import './purchase-confirmed.css';
import { useSelector } from 'react-redux';
import { selectRecentOrder, selectRecentOrderItems } from '../../features/order/selectors';
import { getInvoice } from '../../features/order/api';
import { selectCartTotal } from '../../features/cart/selectors';
import { selectShippingInfo } from '../../features/user/selectors';

export const PurchaseConfirmed = (): JSX.Element => {
  const order = useSelector(selectRecentOrder);
  const orderItems = useSelector(selectRecentOrderItems);
  const total = useSelector(selectCartTotal);
  const shippingInfo = useSelector(selectShippingInfo);
  return (
    <div className='purchase-confirmed'>
      <div className='purchase-col-2'>
        <h1 id='thanks'>Thank you for your purchase</h1>
        <p>
          <b>Invoice #{order && order.id}</b>
        </p>
        <button onClick={() => getInvoice(order.id)}>View the invoice</button>
        <div className='order-payment__wrapper__col-right__details'>
          <h2>Order Summary</h2>
          <p>Products: ${total}</p>
          <p>Shipping: $5</p>
          <p>Tax: $0</p>
        </div>
        <div className='order-payment__wrapper__col-right__shipping'>
          <h2>Shipping Summary</h2>
          <p>{shippingInfo!.address}</p>
          <p>{shippingInfo!.country}</p>
          <p>{shippingInfo!.city}</p>
          <p>{shippingInfo!.postalcode}</p>
        </div>
      </div>
      <div className='purchase-col-1'>
        <p>Order Summary</p>
        <div className='order-table'>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems &&
                orderItems.map(({ productId, image, quantity, price }) => (
                  <tr key={productId}>
                    <td>
                      <img src={image} />
                    </td>
                    <td>{productId}</td>
                    <td>{quantity}</td>
                    <td>${price * quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='purchase-col-right__order-info'>
          <p>Order total: {order && order.total_price}$</p>
          <p>=</p>
          <p>Shipping total: 5$</p>
          <p>+</p>
          <p>Taxes: 0$</p>
        </div>
      </div>
    </div>
  );
};
