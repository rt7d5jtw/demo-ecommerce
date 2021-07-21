import * as React from 'react';
import './checkout.css';
import Alert from '../../features/alert/alert/alert.component';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import { addShippingInformation } from '../../features/user/userSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { selectShippingInfo } from '../../features/user/selectors';
import { shippingInfoAdded } from '../../features/alert/alertSlice';
import { CheckoutItem } from '../checkout-item/checkout-item.component';
import { StripeOrderWrapper } from '../stripe-order-wrapper/stripe-order-wrapper.component';

type FormValues = {
  address: string;
  country: string;
  city: string;
  postalcode: string;
};

const Checkout = (): JSX.Element => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const [warning, setWarning] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);

  const shippingInfo = useSelector(selectShippingInfo);
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (shippingInfo === null) setWarning('Provide shipping information!');
    dispatch(addShippingInformation(data));
    dispatch(shippingInfoAdded());
    shippingInfo !== null && cartItems.length !== 0 ? setSuccess(true) : null;
  };
  return (
    <div className='checkout'>
      <Alert />
      <h1 id='checkout-step'>Shipping</h1>
      <div
        className='checkout__order-information'
        style={success ? { transform: 'translateY(-150%)' } : {}}
      >
        <form className='order-form' onSubmit={handleSubmit(onSubmit)}>
          <label>Shipping address</label>
          <input
            type='address'
            placeholder='Shipping address'
            {...register('address', { required: true })}
            required
          />
          <label>Country</label>
          <input
            type='text'
            placeholder='Country'
            {...register('country', { required: true })}
            required
          />
          <label>City</label>
          <input
            type='text'
            placeholder='City'
            {...register('city', { required: true })}
            required
          />
          <label>Postalcode</label>
          <input
            type='text'
            placeholder='Postal Code'
            {...register('postalcode', { required: true })}
            required
          />
          <input type='submit' value='Add Shipping Information' />
        </form>
        <p>{warning}</p>
      </div>
      {cartItems.length ? (
        <div className='order-summary' style={success ? { transform: 'translateY(-150%)' } : {}}>
          <h1>Products</h1>
          {cartItems.length
            ? cartItems.map(({ title, price, quantity, image, productId }) => (
                <div key={productId} className='cart-item__wrapper'>
                  <CheckoutItem
                    key={productId}
                    productId={productId}
                    title={title}
                    price={price}
                    quantity={quantity}
                    image={image}
                  />
                </div>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default Checkout;
