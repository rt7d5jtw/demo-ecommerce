import * as React from 'react';
import './cart-container.css';
import { GiShoppingBag } from 'react-icons/gi';
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
      isOpen === true &&
      wrappedRef.current &&
      iconRef.current &&
      !iconRef.current.contains(event.target as Node) &&
      !wrappedRef.current.contains(event.target as Node)
    ) {
      dispatch(cartToggle(isOpen));
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

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
      <div
        className='cart-container__cart-icon__container'
        ref={iconRef}
        onClick={() => dispatch(cartToggle(isOpen))}
      >
        <GiShoppingBag className='cart-container__cart-icon' />
        <span className='cart-container__cart-quantity'>{quantity}</span>
      </div>

      <div className={isOpen ? 'cart-content' : 'cart-content--closed'} ref={wrappedRef}>
        <div className='cart-content__checkout'>
          <button className='cart-content__checkout_cart-btn' onClick={() => push('/cart')}>
            View shopping bag
          </button>
          <button className='cart-content__checkout_checkout-btn' onClick={checkout}>
            Checkout
          </button>
          <button
            className='cart-content__checkout_clear-cart-btn'
            onClick={() => cartClear()}
            title='Clears cart from all products'
          >
            Clear all products
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
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, ICart>({
  isOpen: selectOpen,
  cartItems: selectCartItems,
  quantity: selectQuantity,
});

export default connect(mapStateToProps)(CartContainer);
