import * as React from 'react';
import './order-payment.css';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import Main from '../../features/homepage-components/main/main.component';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import { authHeader } from '../../features/user/userSlice';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { fetchAll as fetchAllOrders } from '../../features/order/thunks';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { selectShippingInfo } from '../../features/user/selectors';
import { clearCart } from '../../features/cart/cartSlice';
import { ORDER_URL } from '../../features/order/api';
import { clearCartDB } from '../../features/cart/thunks';
import { takeCart } from '../../features/order/orderSlice';
import { selectRecentOrder, selectRecentOrderItems } from '../../features/order/selectors';

const CARD_OPTIONS = {
  iconStyle: 'solid' as const,
  style: {
    base: {
      iconColor: '#000',
      color: '#000',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: 'gray',
      },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
};

const OrderPayment = (): JSX.Element => {
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const shippingInfo = useSelector(selectShippingInfo);
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { push } = useHistory();

  const handleSubmit = async (carddata: any) => {
    carddata.preventDefault();
    console.log(carddata);
    const cardElement = elements!.getElement(CardElement);
    console.log('Form submitted');
    // Create payment intent on the server.
    const { data } = await axios.post(
      ORDER_URL + 'create-payment-intent',
      { amount: total, currency: 'usd', payment_method_types: 'card' },
      {
        headers: authHeader(),
      }
    );
    // Confirm the payment on the client.
    const paymentConfirmed = await stripe?.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: cardElement!,
      },
    });
    if (paymentConfirmed) {
      setSuccess(!success);
      dispatch(clearCart());
      dispatch(clearCartDB());
      setTimeout(() => push('/purchase-confirmed'), 1500);
    }
  };
  const dispatch = useDispatch();
  const orderItems = useSelector(selectRecentOrderItems);
  useEffect(() => {
    //dispatch(fetchAllOrders());
    if (orderItems === null) {
      dispatch(takeCart(cartItems));
    }
  }, [orderItems]);
  return (
    <div className='order-payment'>
      <div className='order-payment__wrapper'>
        <div className='order-payment__wrapper__col-left'>
          <div className='order-payment__wrapper__col-left__ordered-items'>
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
                {cartItems.map(({ productId, image, quantity, price }) => (
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
        </div>
        <div className='order-payment__wrapper__col-right'>
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

          {!success ? (
            <form id='stripe-wrapper' onSubmit={handleSubmit}>
              <p>Pay with Stripe</p>
              <CardElement options={CARD_OPTIONS} />
              <button disabled={!stripe} id='stripe-wrapper'>
                Pay ${total}
              </button>
              <button onClick={() => setSuccess(!success)}>Set state</button>
            </form>
          ) : (
            <h2>Thanks for your purchase!</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPayment;
