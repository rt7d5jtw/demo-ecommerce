import * as React from 'react';
import StripeCheckout, { Token } from 'react-stripe-checkout';
import axios from 'axios';
import { clearCart } from '../../redux/cart/cart.actions';
import { useDispatch } from 'react-redux';

interface IStripeButton {
  price: number;
  clearCart: () => void;
}

export function StripeButton({ price, clearCart }: IStripeButton) {
  const dispatch = useDispatch();
  const amount = price * 100;
  const publishableKey =
    'pk_test_51HUuCuDiJxi7nioJsEusYP3Ty7hbKaquESZBYVkCuY3g9w2roo3BSMJMPK529s7EIIcBsSxhV6Ym9xFzwCHM0Q9L00KOmEYf1f';

  const onToken = (token: Token) => {
    axios({
      url: 'payment',
      method: 'POST',
      data: {
        amount,
        token,
      },
    })
      .then((res) => {
        alert('Thanks for the payment!');
        dispatch(clearCart());
      })
      .catch((error) => {
        console.log('There was an error in the payment process: ' + error);
        alert('Payment failed, please make sure credit card is provided');
      });
  };
  return (
    <StripeCheckout
      label='Pay now'
      name='Bookstore'
      billingAddress
      shippingAddress
      panelLabel='Pay now'
      amount={amount}
      token={onToken}
      stripeKey={publishableKey}
    />
  );
}
