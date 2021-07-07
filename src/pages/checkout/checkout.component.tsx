import * as React from 'react';
import './checkout.css';
import CartItem from '../../features/cart/cart-item/cart-item.component';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { ICartItem } from '../../features/cart/cartSlice';
import { addShippingInformation } from '../../features/user/userSlice';
import { create as createOrder } from '../../features/order/thunks';
import { useHistory } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { selectShippingInfo } from '../../features/user/selectors';
import { clearRecentOrder, OrderStatus } from '../../features/order/orderSlice';
import { shippingInfoAdded } from '../../features/alert/alertSlice';
import { selectRecentOrder } from '../../features/order/selectors';

interface ICheckout {
  cartItems: ICartItem[];
  total: number;
  clearCart: () => void;
}

type FormValues = {
  address: string;
  country: string;
  city: string;
  postalcode: string;
};

const Checkout = ({ cartItems, total }: ICheckout) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { register, handleSubmit } = useForm<FormValues>();
  const [warning, setWarning] = useState<string>();
  const shippingInfo = useSelector(selectShippingInfo);
  const recentOrder = useSelector(selectRecentOrder);

  function handleOrder() {
    if (shippingInfo && shippingInfo && recentOrder === null) {
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
      push('/payment');
    } else if (shippingInfo === null) {
      setWarning('Provide shipping information!');
    } else if (recentOrder !== null) {
      setWarning('Clearing recent orders...');
      setTimeout(() => setWarning(''), 2000);
      dispatch(clearRecentOrder());
    }
  }
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(addShippingInformation(data));
    dispatch(shippingInfoAdded());
  };
  return (
    <div className='checkout'>
      <div className='checkout__order-information'>
        <h1>Checkout</h1>
        <form className='order-form' onSubmit={handleSubmit(onSubmit)}>
          <label>Shipping information</label>
          <input
            type='address'
            placeholder='Shipping address'
            {...register('address', { required: true })}
            required
          />
          <input
            type='text'
            placeholder='Country'
            {...register('country', { required: true })}
            required
          />
          <input
            type='text'
            placeholder='City'
            {...register('city', { required: true })}
            required
          />
          <input
            type='text'
            placeholder='Postal Code'
            {...register('postalcode', { required: true })}
            required
          />
          <input type='submit' value='Add Shipping Information' />
        </form>
        <h1>Order Summary</h1>
        <h1>Total price: ${total}</h1>
        <button className='order-btn' onClick={() => handleOrder()}>
          Place Order
        </button>
        <p>{warning}</p>
      </div>

      {cartItems.length ? (
        <div className='order-summary'>
          <h1>Products</h1>
          {cartItems.length
            ? cartItems.map(({ title, price, quantity, image, productId }) => (
                <div key={productId} className='cart-item__wrapper'>
                  <CartItem
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

interface IMapStateToProps {
  cartItems: ICartItem[];
  total: number;
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  cartItems: selectCartItems,
  total: selectCartTotal,
});

export default connect(mapStateToProps)(Checkout);
