import * as React from 'react';
import './checkout.css';
import Alert from '../../features/alert/alert/alert.component';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../features/cart/selectors';
import { addShippingInformation } from '../../features/user/userSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { selectShippingInfo } from '../../features/user/selectors';
import { shippingInfoAdded } from '../../features/alert/alertSlice';
import { CheckoutItem } from '../checkout-item/checkout-item.component';
import { useHistory } from 'react-router';
import { clearRecentOrder } from '../../features/order/orderSlice';

type FormValues = {
  address: string;
  country: string;
  city: string;
  postalcode: string;
  tax: number;
  cost: number;
};

const Checkout = (): JSX.Element => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const [warning, setWarning] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const { push } = useHistory();

  React.useEffect(() => {
    if (localStorage.getItem('user') === null) {
      setWarning('You have to be logged in to continue with shipping!');
      setDisable(true);
    }
  }, [localStorage.getItem('user')]);

  const shippingInfo = useSelector(selectShippingInfo);
  const cartItems = useSelector(selectCartItems);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (shippingInfo && shippingInfo.country == 'Finland') data['tax'] = 0;
    if (shippingInfo && shippingInfo.country != 'Finland') data['tax'] = 2.5;
    if (shippingInfo === null) setWarning('Provide shipping information!');
    dispatch(addShippingInformation(data));
    dispatch(shippingInfoAdded());
    shippingInfo !== null && cartItems.length !== 0 ? setSuccess(true) : null;
    dispatch(clearRecentOrder());
    push('/payment');
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
            disabled={disable}
            type='address'
            placeholder='Shipping address'
            {...register('address', { required: true })}
            required
          />
          <label>Country</label>
          <input
            disabled={disable}
            type='text'
            placeholder='Country'
            {...register('country', { required: true })}
            required
          />
          <label>City</label>
          <input
            disabled={disable}
            type='text'
            placeholder='City'
            {...register('city', { required: true })}
            required
          />
          <label>Postalcode</label>
          <input
            disabled={disable}
            type='text'
            placeholder='Postal Code'
            {...register('postalcode', { required: true })}
            required
          />
          <input type='submit' value='Add Shipping Information' />
        </form>
        <p id='checkout-warning'>{warning}</p>
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
