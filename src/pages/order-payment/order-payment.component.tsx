import * as React from 'react';
import './order-payment.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotal } from '../../features/cart/selectors';
import { authHeader } from '../../features/user/api';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { selectShippingInfo } from '../../features/user/selectors';
import { clearCart } from '../../features/cart/cartSlice';
import { ORDER_URL } from '../../features/order/api';
import { clearCartDB } from '../../features/cart/thunks';
import { OrderStatus } from '../../features/order/orderSlice';
import { create as createOrder } from '../../features/order/thunks';
import { paymentSuccess } from '../../features/alert/alertSlice';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';

const OrderPayment = (): JSX.Element => {
  const dispatch = useDispatch();
  const [payment, setPayment] = useState({
    success: false,
    submitted: false,
    payment_method_submit: false,
    payment_method: '',
    value: '',
    status: '',
    paymentIntent: {},
    submitCount: 0,
    accepted: false,
  });
  const [error, setError] = useState('');

  const CARD_OPTIONS = {
    disabled: false,
    iconStyle: 'solid' as const,
    style: {
      base: {
        iconColor: '#6772e5',
        color: '#6772e5',
        fontWeight: 600,
        fontFamily: 'Montserrat, Open Sans, Segoe UI, sans-serif',
        fontSize: '10px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#6772e5',
        },
        '::placeholder': {
          color: '#6772e5',
        },
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee',
      },
    },
  };

  const { push } = useHistory();
  const total = useSelector(selectCartTotal);
  const shippingInfo = useSelector(selectShippingInfo);

  const stripe = useStripe();
  const elements = useElements();

  const handleMethod = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (
      (event.currentTarget.elements.namedItem('method') as HTMLInputElement)
        .value === 'stripe'
    ) {
      setPayment({
        ...payment,
        payment_method: 'stripe',
        payment_method_submit: true,
      });
    } else if (
      (event.currentTarget.elements.namedItem('method') as HTMLInputElement)
        .value === 'paypal'
    ) {
      setPayment({
        ...payment,
        payment_method: 'paypal',
        payment_method_submit: true,
      });
    }
  };

  const stripeElementChange = (e: StripeCardElementChangeEvent) => {
    if (payment.submitted && e.empty) {
      setError('Do not submit an empty form!');
    }
    if (e.error) {
      setPayment({ ...payment, status: 'error' });
      setError(e.error.message ?? 'An unknown error occured');
    }
    if (!e.empty && e.complete) {
      setPayment({ ...payment, accepted: true });
    }
  };

  const handlePayment: React.FormEventHandler<HTMLFormElement> = async (
    e
  ): Promise<void> => {
    e.preventDefault();

    if (payment.submitCount >= 4) {
      setError('Too many submits, please wait for response');
      setTimeout(
        () => setPayment({ ...payment, submitCount: 0, submitted: false }),
        2000
      );
    }
    if (payment.submitCount >= 10) {
      setError('Do not spam the prompt!');
    }
    setPayment({
      ...payment,
      submitted: true,
      submitCount: payment.submitCount + 1,
    });
    if (!stripe || !elements) return;
    if (!e.currentTarget.reportValidity()) return;
    if (!payment.accepted) {
      setError('Finish payment information!');
      return;
    }
    const cardElement = elements && elements.getElement(CardElement);

    if (shippingInfo && payment.accepted === true)
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
    const res = await axios.post(
      ORDER_URL + 'create-payment-intent',
      { amount: total, currency: 'usd', payment_method_types: 'card' },
      {
        headers: authHeader(),
      }
    );

    if (payment.accepted) {
      setError('Processing payment...');
    }

    if (res.status === 500) {
      setError(res.data.message);
      setPayment({ ...payment, status: 'error' });
      return;
    }

    if (!cardElement) return;
    /* Confirm the payment on the client */
    const { error, paymentIntent } = await stripe?.confirmCardPayment(
      res.data.client_secret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setPayment({ ...payment, status: 'error' });
      setError(error.message ?? 'An unknown error occured');
    } else if (paymentIntent) {
      setPayment({ ...payment, paymentIntent: paymentIntent });
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      dispatch(paymentSuccess());
      dispatch(clearCart());
      dispatch(clearCartDB());
      setTimeout(() => push('/purchase-confirmed'), 500);
    }
  };

  return (
    <div className='order-payment'>
      <h3 id='stripe-notice'>
        Use <i id='stripe-testnums'>4242 4242 4242 4242</i> for stripe to test
        the payment
      </h3>
      <div className='order-payment__wrapper'>
        {!payment.payment_method_submit ? (
          <form onSubmit={handleMethod}>
            <legend>Select payment method</legend>
            <fieldset>
              <input type='radio' id='stripe' name='method' value='stripe' />
              <label htmlFor='stripe'>Stripe</label>
            </fieldset>
            <input type='submit' value='Submit' />
          </form>
        ) : payment.payment_method_submit &&
          payment.payment_method === 'stripe' ? (
          <div className='payment-stripe'>
            <form onSubmit={handlePayment}>
              <fieldset className='elements-style'>
                <legend>Card details:</legend>
                <div className='FormRow elements-style'>
                  <CardElement
                    options={CARD_OPTIONS}
                    onChange={stripeElementChange}
                  />
                </div>
                <button
                  className='elements-style'
                  disabled={payment.submitted ? true : false}
                  onClick={() =>
                    setPayment({
                      ...payment,
                      submitted: true,
                      submitCount: payment.submitCount + 1,
                    })
                  }
                >
                  Pay ${total}
                </button>
              </fieldset>
            </form>
          </div>
        ) : null}
        <div className='order-payment__error-prompt'>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderPayment;
