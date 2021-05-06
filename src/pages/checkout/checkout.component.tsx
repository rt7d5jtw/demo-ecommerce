import * as React from 'react';
import './checkout.css';
import { Footer } from '../../components/footer/footer.component';
import { Navbar } from '../../components/navbar/navbar.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import __CartItem from '../../components/cart-item/cart-item.component';
import { connect } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../redux/cart/cart.selectors';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../redux/root-reducer';
import { CartItem } from '../../redux/types';
import Alert from '../../components/alert/alert.component';
import { StripeButton } from '../../components/stripe-button/stripe-button.component';
import Main from '../main/main.component';

interface ICheckout {
  cartItems: CartItem[];
  total: number;
  clearCart: () => void;
}

const Checkout = ({ cartItems, total, clearCart }: ICheckout) => {
  return (
    <div className='homepage'>
      <Alert />
      <Navbar />
      <Sidebar />
      <Main>
        <div className='checkout'>

          <div className='order-information'>
            <h1> Checkout </h1>
            <form className='order-form'>
              <label>Order information</label>
              <input type='address' name='address' placeholder='Order address' required />
              <input type='name' name='name' placeholder='Name' required />
              <input type='email' name='email' placeholder='Email' required />
            </form>
            <h1>Order Summary</h1>
            <h1>Total price: ${total}</h1>
            <StripeButton price={total} clearCart={clearCart} />
          </div>

          {cartItems.length ? (
            <div className='order-summary'>
              <h1>Products</h1>
              {cartItems.length
                ? cartItems.map(({ title, price, quantity, image, id }) => (
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
  cartItems: CartItem[];
  total: number;
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  cartItems: selectCartItems,
  total: selectCartTotal,
});

export default connect(mapStateToProps)(Checkout);
