import * as React from 'react';
import './purchase-confirmed.css';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import Main from '../../features/homepage-components/main/main.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { useSelector } from 'react-redux';
import { selectRecentOrder, selectRecentOrderItems } from '../../features/order/selectors';
//import { selectOrders } from '../../features/order/orderSlice';

export const PurchaseConfirmed = (): JSX.Element => {
  const order = useSelector(selectRecentOrder);
  const orderItems = useSelector(selectRecentOrderItems);
  return (
    <div className='purchase-confirmed'>
      <div className='purchase-col-2'>
        <h1 id='thanks'>Thank you for your purchase</h1>
        <p>
          <b>Invoice #{order && order.id}</b>
        </p>
        <a href='yeet'>View the invoice</a>
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
