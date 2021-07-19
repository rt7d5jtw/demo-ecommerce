import * as React from 'react';
import Checkout from '../checkout/checkout.component';
import { StripeOrderWrapper } from '../stripe-order-wrapper/stripe-order-wrapper.component';

const CheckoutWrapper = (): JSX.Element => {
  return (
    <div className='checkout-wrapper'>
      <Checkout />
      <StripeOrderWrapper />
    </div>
  );
};

export default CheckoutWrapper;
