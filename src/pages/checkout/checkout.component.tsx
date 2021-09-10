import * as React from 'react';
import './checkout.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../features/cart/selectors';
import { addShippingInformation } from '../../features/user/userSlice';
import { useState } from 'react';
import { selectAccessToken, selectShippingInfo } from '../../features/user/selectors';
import { shippingInfoAdded } from '../../features/alert/alertSlice';
import { CheckoutItem } from '../checkout-item/checkout-item.component';
import { useHistory } from 'react-router';
import { clearRecentOrder } from '../../features/order/orderSlice';
import { TestForm } from '../../features/forms/testform';
import { handleForm } from '../../features/forms/utils/utils';

const Checkout = (): JSX.Element => {
  const shippingInfo = useSelector(selectShippingInfo);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);

  const [warning, setWarning] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const { push } = useHistory();

  React.useEffect(() => {
    if (token === null) {
      setWarning('You have to be logged in to continue with shipping!');
      setDisable(true);
    }
    if (token !== null && cartItems.length === 0) {
      setWarning('You have no items in your cart, so you cannot proceed with payment');
      setDisable(true);
    }
  }, [token]);

  function onSubmit(event: React.BaseSyntheticEvent) {
    event.preventDefault();
    const data = handleForm(event.currentTarget.elements);
    if (
      data.city.match(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/gi) == null ||
      data.country.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) == null ||
      data.postalcode.match(/^\d{5}(?:[-\s]\d{4})?$/gi) == null
    ) {
      setWarning('Validation error, give proper inputs');
      return;
    }

    if (warning.length < 1) {
      for (const key in data) {
        if (data[key] == '' || data[key] == undefined || data[key] == null) {
          setWarning('Validation error, give proper inputs');
          return;
        }
        setSuccess(true);
      }

      if (shippingInfo && shippingInfo.country == 'Finland') data['tax'] = 0;
      if (shippingInfo && shippingInfo.country != 'Finland') data['tax'] = 2.5;
      if (shippingInfo === null) setWarning('Provide shipping information!');

      if (warning.length === 0 && data.address.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
        dispatch(addShippingInformation(data));
        dispatch(shippingInfoAdded());
        shippingInfo !== null && cartItems.length !== 0 ? setSuccess(true) : null;
        dispatch(clearRecentOrder());
        push('/payment');
      } else {
        setWarning('Validation error, give proper inputs');
      }
    }
  }
  return (
    <div className='checkout'>
      <div className='checkout-step-wrapper'>
        <h1 id='checkout-step'>Shipping</h1>
      </div>
      <div
        className='checkout__order-information'
        style={success ? { transform: 'translateY(-150%)' } : {}}
      >
        <TestForm
          fields={{
            labels: [
              {
                orderIdentifier: 1,
                label: 'Shipping Address',
                htmlFor: 'address',
              },
              {
                orderIdentifier: 3,
                label: 'Country',
                htmlFor: 'country',
              },
              {
                orderIdentifier: 5,
                label: 'City',
                htmlFor: 'city',
              },
              {
                orderIdentifier: 7,
                label: 'Postal Code',
                htmlFor: 'postalcode',
              },
            ],
            input: [
              {
                orderIdentifier: 2,
                type: 'address',
                name: 'address',
                id: 'address',
                placeholder: 'Shipping address',
                title: 'You must specify an address',
                maxLength: 256,
                minLength: 3,
                required: true,
                disabled: disable,
              },
              {
                orderIdentifier: 4,
                type: 'text',
                name: 'country',
                id: 'country',
                placeholder: 'Country',
                title: 'You must specify a country',
                maxLength: 128,
                minLength: 3,
                required: true,
                disabled: disable,
              },
              {
                orderIdentifier: 6,
                type: 'text',
                name: 'city',
                id: 'city',
                placeholder: 'City',
                title: 'You must specify a city',
                maxLength: 256,
                minLength: 3,
                required: true,
                disabled: disable,
              },
              {
                orderIdentifier: 8,
                type: 'text',
                name: 'postalcode',
                id: 'postalcode',
                placeholder: 'Postal Code',
                title: 'You must specify a postal code',
                maxLength: 256,
                minLength: 3,
                required: true,
                disabled: disable,
              },
            ],
            warning: [{ orderIdentifier: 9, warning: warning }],
          }}
          onSubmit={onSubmit}
          submitlabel='Submit Shipping Information'
          headlabel=''
        />
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
