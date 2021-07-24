import * as React from 'react';
import './order-payment.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import { authHeader } from '../../features/user/userSlice';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { selectShippingInfo } from '../../features/user/selectors';
import { clearCart } from '../../features/cart/cartSlice';
import { fetchAllOrders, ORDER_URL, updateOrder } from '../../features/order/api';
import { clearCartDB } from '../../features/cart/thunks';
import { IOrder, OrderStatus, takeCart } from '../../features/order/orderSlice';
import { selectRecentOrderItems } from '../../features/order/selectors';
import { create as createOrder } from '../../features/order/thunks';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { AnyAction, Dispatch } from 'redux';
import { paymentSuccess } from '../../features/alert/alertSlice';

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
  const [state, setState] = useState({
    submitted: false,
    value: '',
  });
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const { push } = useHistory();

  const dispatch = useDispatch();
  const orderItems = useSelector(selectRecentOrderItems);
  const total = useSelector(selectCartTotal);
  const cartItems = useSelector(selectCartItems);
  const shippingInfo = useSelector(selectShippingInfo);

  useEffect(() => {
    //dispatch(fetchAllOrders());
    if (orderItems === null) {
      dispatch(takeCart(cartItems));
    }
  }, [orderItems]);

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      value: event.target.value,
      submitted: false,
    });
    console.log(state);
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setState({
      ...state,
      submitted: true,
    });
    console.log(event.target);
  };

  const handlePayment = async (carddata: any) => {
    if (!stripe || !elements) return;
    carddata.preventDefault();
    console.log(carddata);
    const cardElement = elements && elements.getElement(CardElement);
    console.log('Form submitted');

    if (shippingInfo)
      dispatch(
        createOrder({
          total_price: total,
          status: OrderStatus.UNPAID,
          address: shippingInfo.address,
          country: shippingInfo.country,
          city: shippingInfo.city,
          postalcode: shippingInfo.postalcode,
        })
      );
    /* Create payment intent on the server */
    const { data } = await axios.post(
      ORDER_URL + 'create-payment-intent',
      { amount: total, currency: 'usd', payment_method_types: 'card' },
      {
        headers: authHeader(),
      }
    );

    if (!cardElement) return;
    /* Confirm the payment on the client */
    const paymentConfirmed = await stripe?.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: cardElement,
      },
    });
    if (paymentConfirmed) {
      setSuccess(!success);
      dispatch(paymentSuccess());
      dispatch(clearCart());
      dispatch(clearCartDB());
      setTimeout(() => push('/purchase-confirmed'), 1000);
    }
  };

  return (
    <div className='order-payment'>
      <h1 id='checkout-step2'>Payment</h1>
      <div className='order-payment__wrapper'>
        <div
          className='order-payment__wrapper__payment-method'
          style={
            state.value !== '' && state.submitted === true
              ? { transform: 'translateY(-200%)', opacity: '0' }
              : {}
          }
        >
          <form name='payform' onSubmit={handleSubmit}>
            <h1>Select payment method</h1>
            <fieldset>
              <input
                type='radio'
                id='paymethod-stripe'
                name='paymethod'
                value='stripe'
                onChange={handleChange}
              />
              <label htmlFor='paymethod-stripe'>Stripe</label>
            </fieldset>
            <fieldset>
              <input
                type='radio'
                id='paymethod-paypal'
                name='paymethod'
                value='paypal'
                onChange={handleChange}
              />
              <label htmlFor='paymethod-paypal'>Paypal</label>
            </fieldset>
            <input type='submit' value='Submit' />
          </form>
        </div>
        <div className='order-payment__wrapper__payment-window'>
          {!success ? (
            <form
              id='stripe-wrapper'
              onSubmit={handlePayment}
              style={
                state.value !== '' && state.submitted === true
                  ? { transform: 'translateY(-130%)', opacity: '1' }
                  : {}
              }
            >
              <fieldset>
                <p>Pay with Stripe</p>
              </fieldset>
              <CardElement options={CARD_OPTIONS} />
              <button disabled={!stripe} id='stripe-wrapper'>
                Pay ${15}
              </button>
            </form>
          ) : (
            <h2>Thanks for your purchase!</h2>
          )}{' '}
        </div>
      </div>
    </div>
  );
};

export default OrderPayment;
