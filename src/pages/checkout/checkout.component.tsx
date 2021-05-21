import * as React from 'react';
import './checkout.css';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import __CartItem from '../../features/cart/cart-item/cart-item.component';
import { connect } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/cartSlice';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { CartItem } from '../../features/cart/cartSlice';
import Alert from '../../features/alert/alert/alert.component';
import { StripeButton } from '../../features/order/stripe-button/stripe-button.component';
import Main from '../../features/homepage-components/main/main.component';

interface ICheckout {
  items: CartItem[];
  total: number;
  clearCart: () => void;
}

const Checkout = ({ items, total, clearCart }: ICheckout) => {
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
