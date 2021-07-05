import * as React from 'react';
import './cart-container.css';
import { TiShoppingCart } from 'react-icons/ti';
import { connect } from 'react-redux';
import { RootState } from '../../../app/store';
import { cartToggle, clearCart, ICartItem } from '../../cart/cartSlice';
import { selectOpen, selectCartItems, selectQuantity } from '../../cart/selectors';
import { clearCartDB } from '../../cart/thunks';
import { useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import CartItem from '../cart-item/cart-item.component';
import { useHistory } from 'react-router-dom';
import { useRef, useEffect } from 'react';

interface ICart {
  isOpen: boolean;
  cartItems: ICartItem[];
  quantity: number;
}

const CartContainer = ({ isOpen, cartItems, quantity }: ICart) => {
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
    console.group('items =>', cartItems);
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
      dispatch(clearCartDB());
    }
  }

  return (
    <div className='cart-container'>
      <div ref={iconRef}>
        <TiShoppingCart
          className='cart-container__cart-icon'
          onClick={() => dispatch(cartToggle(isOpen))}
        />
        <span className='cart-container__cart-quantity'>{quantity}</span>
      </div>

      {isOpen ? (
        <div className='cart-content' ref={wrappedRef}>
          <div className='cart-content__checkout'>
            <button className='cart-content__checkout_checkout-btn' onClick={checkout}>
              Checkout
            </button>
            <button
              className='cart-content__checkout_clear-cart-btn'
              onClick={() => cartClear()}
              title='Clears cart from all products'
            >
              Clear Cart
            </button>
          </div>
          {cartItems.length ? (
            cartItems.map(({ title, price, image, quantity, productId }) => (
              <CartItem
                key={productId}
                productId={productId}
                title={title}
                price={price}
                image={image}
                quantity={quantity}
              />
            ))
          ) : (
            <span className='cart-content__empty-cart'>Cart is empty</span>
          )}
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, ICart>({
  isOpen: selectOpen,
  cartItems: selectCartItems,
  quantity: selectQuantity,
});

export default connect(mapStateToProps)(CartContainer);
