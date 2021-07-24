import * as React from 'react';
import './cart-item.css';
import { ICartItem } from '../../../features/cart/cartSlice';
import { removeItemDB } from '../../../features/cart/thunks';
import { useDispatch } from 'react-redux';
import { removeItem } from '../../cart/cartSlice';

const CartItem = (cartItem: ICartItem): JSX.Element => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const dispatch = useDispatch();

  function removeHandler() {
    dispatch(removeItem(cartItem));
    if (user && user.accessToken) {
      if (cartItem.productId != undefined) {
        dispatch(removeItemDB(cartItem.productId));
      }
    }
  }

  return (
    <div className='cart-item'>
      <div className='cart-item__right'>
        <img
          className='cart-item__right__image'
          src={require(`../../../assets/${cartItem.image}`)}
        />
      </div>
      <div className='cart-item__left'>
        <span className='cart-item__left__title'>{cartItem.title}</span>
        <span className='cart-item__left__price'>Price: ${cartItem.price * cartItem.quantity}</span>
        <span className='cart-item__left__qty'>Quantity: {cartItem.quantity}</span>
      </div>
      <button
        className='cart-item__remove-btn'
        title='Removes the product from cart'
        onClick={() => removeHandler()}
      >
        X
      </button>
    </div>
  );
};

export default CartItem;
