import * as React from 'react';
import './cart.css';
import { TiShoppingCart } from 'react-icons/ti';
import { connect } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  cartToggle,
  clearCart,
  selectOpen,
  selectCartItems,
  selectQuantity,
  CartItem,
  clearCartDB,
} from '../../cart/cartSlice';
import { useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import __CartItem from '../cart-item/cart-item.component';
import { useHistory } from 'react-router-dom';
import { useRef, useEffect } from 'react';

interface ICart {
  isOpen: boolean;
  items: CartItem[];
  quantity: number;
}

const Cart = ({ isOpen, items, quantity }: ICart) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const dispatch = useDispatch();
  const wrappedRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const { push } = useHistory();

  const handleClickOutside = (event: Event) => {
    if (
      wrappedRef.current &&
      iconRef.current &&
      !iconRef.current.contains(event.target as Node) &&
      !wrappedRef.current.contains(event.target as Node)
    ) {
      dispatch(cartToggle(isOpen));
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  function checkout() {
    push('/checkout');
    dispatch(cartToggle(isOpen));
  }

  function cartClear() {
    dispatch(clearCart());
    if (user && user.accessToken) {
      dispatch(clearCartDB())
    }
  }

  return (
    <div className='cart'>
      <div ref={iconRef}>
        <TiShoppingCart className='cart-icon' onClick={() => dispatch(cartToggle(isOpen))} />
        <span className='cart-quantity'>{quantity}</span>
      </div>

      {isOpen ? (
        <div className='cart-content' ref={wrappedRef}>
          <div className='checkout-cart'>
            <button className='checkout-btn' onClick={checkout}>
              Checkout
            </button>
            <button
              className='clear-cart-btn'
              onClick={() => cartClear()}
              title='Clears cart from all products'
            >
              Clear Cart
            </button>
          </div>
          {items.length ? (
            items.map(({ title, price, image, quantity, id }) => (
              <__CartItem
                key={id}
                id={id}
                title={title}
                price={price}
                image={image}
                quantity={quantity}
              />
            ))
          ) : (
            <span className='empty-cart'>Cart is empty</span>
          )}
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, ICart>({
  isOpen: selectOpen,
  items: selectCartItems,
  quantity: selectQuantity,
});

export default connect(mapStateToProps)(Cart);
