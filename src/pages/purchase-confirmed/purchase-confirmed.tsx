import * as React from 'react';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import Main from '../../features/homepage-components/main/main.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import './purchase-confirmed.css';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../features/cart/cartSlice';
//import { selectOrders } from '../../features/order/orderSlice';

export const PurchaseConfirmed = (): JSX.Element => {
  const cartItems = useSelector(selectCartItems);
  //const orders = useSelector(selectOrders);
  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <div className='purchase-confirmed'>
          <div className='purchase-col-1'>
            <h1>Thank you for your purchase</h1>
            <p>Order Summary</p>
            <div className='ordered-items'>
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
                  {cartItems.map(({ id, image, quantity, price }) => (
                    <tr key={id}>
                      <td>
                        <img src={image} />
                      </td>
                      <td>{id}</td>
                      <td>{quantity}</td>
                      <td>${price * quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='purchase-col-2'>
            <p>
              <b>Invoice #</b>34356
            </p>
            <a href='yeet'>View the invoice</a>
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
};
