import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import './cart.css';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { BiMinusCircle } from 'react-icons/bi';
import { FaStripe } from 'react-icons/fa';
import { FaCcPaypal } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { addShippingInformation } from '../../features/user/userSlice';
import { selectShippingInfo } from '../../features/user/selectors';
import Alert from '../../features/alert/alert/alert.component';
import { promoAdded } from '../../features/alert/alertSlice';
import { addItem, ICartItem, removeItem } from '../../features/cart/cartSlice';
import { addItemDB, removeItemDB } from '../../features/cart/thunks';
import { takeCart } from '../../features/order/orderSlice';

const Cart = (): JSX.Element => {
  const { push } = useHistory();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const shippingInfo = useSelector(selectShippingInfo);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  React.useEffect(() => {
    if (shippingInfo === null || (shippingInfo.cost == null && parsedTotal == 0)) {
      dispatch(addShippingInformation({ cost: 5 }));
    }
  }, [shippingInfo]);

  const deliveryHandler = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    event.target.value === 'Express Delivery'
      ? dispatch(addShippingInformation({ cost: 10 }))
      : dispatch(addShippingInformation({ cost: 5 }));
  };

  const promoHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'CHOCOLATE') {
      parsedTotal - 5;
      setDisabled(true);
      dispatch(promoAdded());
    }
    event.target.value === 'CHOCOLATE' ? dispatch(addShippingInformation({ promo: 5 })) : null;
  };

  function addHandler(cartItem: ICartItem) {
    dispatch(addItem(cartItem));
    if (user && user.accessToken) {
      if (cartItem.productId != undefined) {
        dispatch(addItemDB(cartItem.productId));
      }
    }
  }

  function removeHandler(cartItem: ICartItem) {
    dispatch(removeItem(cartItem));
    if (user && user.accessToken) {
      if (cartItem.productId != undefined) {
        dispatch(removeItemDB(cartItem.productId));
      }
    }
  }

  function checkoutHandler() {
    dispatch(takeCart(cartItems));
    push('/checkout');
  }

  let parsedTotal = total;
  if (shippingInfo !== null && shippingInfo.cost) {
    parsedTotal = shippingInfo.cost + total;
  }
  return (
    <div className='cart'>
      <Alert />
      <div className='cart__wrapper'>
        <div className='cart__wrapper__header'>
          <h1>The Shopping Bag</h1>
        </div>
        <div
          style={cartItems.length > 4 ? { overflowY: 'scroll' } : {}}
          className='cart__wrapper__items'
        >
          <table>
            {cartItems.length !== 0 ? (
              <tbody>
                {cartItems.map((cartItem: ICartItem) => (
                  <tr key={cartItem.productId}>
                    <td>
                      <img src={require(`../../assets/${cartItem.image}`)} />
                    </td>
                    <td className='ctw-title'>{cartItem.title}</td>
                    <td className='ctw-qty'>
                      <i>
                        <HiOutlinePlusCircle onClick={() => addHandler(cartItem)} />
                      </i>
                      {cartItem.quantity}
                      <i>
                        <BiMinusCircle onClick={() => removeHandler(cartItem)} />
                      </i>
                    </td>
                    <td className='ctw-price'>${cartItem.price}</td>
                    <td>
                      <p className='ctw-remove' onClick={() => removeHandler(cartItem)}>
                        Remove
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <p id='cart-is-empty'>Cart is empty :(</p>
            )}
          </table>
        </div>
        <div className='cart__wrapper__right'>
          <div className='cart__wrapper__right__info'>
            <p>
              Subtotal: <span>${total}</span>
            </p>
            <p>
              Shipping:{' '}
              <select onChange={deliveryHandler}>
                <option value='Standard Pick Up Point'>Standard Pick Up Point</option>
                <option value='Express Delivery'>Express Delivery</option>
              </select>
            </p>
            <p>
              Promocode:{' '}
              <input
                disabled={disabled}
                onChange={promoHandler}
                id='promocode'
                type='text'
                placeholder='Promotion code'
              />
            </p>
            <br />
            <h1>
              Order Total: <span id='order-total'>${parsedTotal}</span>
            </h1>
          </div>
          <div className='cart__wrapper__right__ch'>
            <button onClick={checkoutHandler}>Checkout</button>
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
