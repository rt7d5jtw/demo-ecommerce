import { Elements } from '@stripe/react-stripe-js';
import * as React from 'react';
import OrderPayment from '../order-payment/order-payment.component';
import { loadStripe } from '@stripe/stripe-js';

const ELEMENTS_OPTIONS = {
  fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Montserrat' }],
};
const stripePromise = loadStripe(
  'pk_test_51HUuCuDiJxi7nioJsEusYP3Ty7hbKaquESZBYVkCuY3g9w2roo3BSMJMPK529s7EIIcBsSxhV6Ym9xFzwCHM0Q9L00KOmEYf1f'
);

export const StripeOrderWrapper = (): JSX.Element => {
  return (
    <>
      <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
        <OrderPayment />
      </Elements>
    </>
  );
};
