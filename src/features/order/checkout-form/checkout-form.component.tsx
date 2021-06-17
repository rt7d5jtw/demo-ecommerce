import * as React from 'react';
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CardField, SubmitButton } from '../stripe-form/stripe-form.component';
import { payment } from '../orderSlice';

export const CheckoutForm = (): JSX.Element => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      console.log(result.error.message);
    } else {
      // Send the token to your server.
      // This function does not exist yet; we will define it in the next step.
      payment(result.token);
    }
  };

  const onChange = () => {
    console.log('i eat ass');
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardField onChange={onChange} />
      <SubmitButton amount={25} />
    </form>
  );
};
