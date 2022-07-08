import { Elements } from '@stripe/react-stripe-js';
import * as React from 'react';
import OrderPayment from '../order-payment/order-payment.component';
import { loadStripe } from '@stripe/stripe-js';

const ELEMENTS_OPTIONS = {
  fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Montserrat' }],
};

const stripePromise = loadStripe(
  process.env.STRIPE_PUBLISHABLE_KEY
);

const StripeOrderWrapper = (): JSX.Element => {
  return (
    <>
      <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
        <OrderPayment />
      </Elements>
    </>
  );
};

export default StripeOrderWrapper;
