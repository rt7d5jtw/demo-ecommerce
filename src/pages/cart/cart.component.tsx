import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import './cart.css';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { BiMinusCircle } from 'react-icons/bi';
import { FaStripe } from 'react-icons/fa';
import { FaCcPaypal } from 'react-icons/fa';

const Cart = (): JSX.Element => {
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  return (
    <div className='cart'>
      <div className='cart__wrapper'>
        <div className='cart__wrapper__header'>
          <h1>The Shopping Bag</h1>
        </div>
        <div className='cart__wrapper__items'>
          <table>
            <tbody>
              {cartItems.map(({ productId, title, image, quantity, price }) => (
                <tr key={productId}>
                  <td>
                    <img src={image} />
                  </td>
                  <td className='ctw-title'>{title}</td>
                  <td className='ctw-qty'>
                    <i>
                      <HiOutlinePlusCircle onClick={() => alert('plus')} />
                    </i>
                    <p>{quantity}</p>
                    <i>
                      <BiMinusCircle onClick={() => alert('minus')} />
                    </i>
                  </td>
                  <td className='ctw-price'>${price}</td>
                  <td>
                    <p className='ctw-remove' onClick={() => alert('I like chocolate')}>
                      Remove
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='cart__wrapper__right'>
          <div className='cart__wrapper__right__info'>
            <p>
              Subtotal: <span>${total}</span>
            </p>
            <p>
              Shipping:{' '}
              <select>
                <option value='Standard Pick Up Point'>Standard Pick Up Point</option>
                <option value='Express Delivery'>Express Delivery</option>
              </select>
            </p>
            <p>
              Promocode: <input id='promocode' type='text' placeholder='Promotion code' />
            </p>
            <br />
            <h1>
              Order Total: <span id='order-total'>${total}</span>
            </h1>
          </div>
          <div className='cart__wrapper__right__ch'>
            <button>Checkout</button>
            <span>
              Payment options:{' '}
              <i>
                <FaStripe />
              </i>{' '}
              <i>
                <FaCcPaypal />
              </i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
