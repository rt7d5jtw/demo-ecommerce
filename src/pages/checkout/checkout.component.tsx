import * as React from 'react';
import './checkout.css';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import __CartItem from '../../features/cart/cart-item/cart-item.component';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { CartItem } from '../../features/cart/cartSlice';
import { addShippingInformation } from '../../features/user/userSlice';
import { create } from '../../features/order/thunks';
import Alert from '../../features/alert/alert/alert.component';
import Main from '../../features/homepage-components/main/main.component';
import { useHistory } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { selectShippingInfo } from '../../features/user/selectors';
import { OrderStatus } from '../../features/order/orderSlice';

interface ICheckout {
  items: CartItem[];
  total: number;
  clearCart: () => void;
}

type FormValues = {
  address: string;
  country: string;
  city: string;
  postalcode: string;
};

const Checkout = ({ items, total }: ICheckout) => {
  const dispatch = useDispatch();
  const shippingInfo = useSelector(selectShippingInfo);
  const { push } = useHistory();
  const { register, handleSubmit } = useForm<FormValues>();
  const [warning, setWarning] = useState<string>();
  function handleOrder() {
    if (
      shippingInfo.address.length !== 0 &&
      shippingInfo.postalcode !== null &&
      shippingInfo.country.length !== 0 &&
      shippingInfo.city.length !== 0
    ) {
      dispatch(
        create({
          total_price: total,
          status: OrderStatus.UNPAID,
          address: shippingInfo.address,
          country: shippingInfo.country,
          city: shippingInfo.city,
          postalcode: shippingInfo.postalcode,
        })
      );
      push('/payment');
    } else {
      setWarning('Provide shipping information!');
    }
  }
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    dispatch(addShippingInformation(data));
  };
  return (
    <div className='homepage'>
      <Alert />
      <Navbar />
      <Sidebar />
      <Main>
        <div className='checkout'>
          <div className='order-information'>
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

          {items.length ? (
            <div className='order-summary'>
              <h1>Products</h1>
              {items.length
                ? items.map(({ title, price, quantity, image, id }) => (
                    <__CartItem
                      key={id}
                      id={id}
                      title={title}
                      price={price}
                      quantity={quantity}
                      image={image}
                    />
                  ))
                : null}
            </div>
          ) : null}
        </div>
      </Main>
      <Footer />
    </div>
  );
};

interface IMapStateToProps {
  items: CartItem[];
  total: number;
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  items: selectCartItems,
  total: selectCartTotal,
});

export default connect(mapStateToProps)(Checkout);
