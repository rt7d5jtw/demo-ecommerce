import * as React from 'react';
import './cart-item.css';
import { ICartItem } from '../../../features/cart/cartSlice';
import { removeItemDB } from '../../../features/cart/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem } from '../../cart/cartSlice';
import { selectAccessToken } from '../../user/selectors';

const CartItem = (cartItem: ICartItem): JSX.Element => {
  const token = useSelector(selectAccessToken);
  const dispatch = useDispatch();

  function removeHandler() {
    dispatch(removeItem(cartItem));

    // If user is logged in, send request to database instead.
    if (token) {
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

export default React.memo(CartItem);
