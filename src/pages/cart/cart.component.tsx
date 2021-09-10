import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../features/cart/selectors';
import './cart.css';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { BiMinusCircle } from 'react-icons/bi';
import { FaStripe } from 'react-icons/fa';
import { FaCcPaypal } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router';
import { addShippingInformation } from '../../features/user/userSlice';
import { selectAccessToken, selectShippingInfo } from '../../features/user/selectors';
import { promoAdded } from '../../features/alert/alertSlice';
import { addItem, ICartItem, removeItem } from '../../features/cart/cartSlice';
import { addItemDB, removeItemDB } from '../../features/cart/thunks';

const Cart = (): JSX.Element => {
  const token = useSelector(selectAccessToken);
  const { push } = useHistory();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const shippingInfo = useSelector(selectShippingInfo);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = React.useState<boolean>(false);

  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
    if (token) {
      if (cartItem.productId != undefined) {
        dispatch(addItemDB(cartItem.productId));
      }
    }
  }

  function removeHandler(cartItem: ICartItem) {
    dispatch(removeItem(cartItem));
    if (token) {
      if (cartItem.productId != undefined) {
        dispatch(removeItemDB(cartItem.productId));
      }
    }
  }

  function checkoutHandler() {
    push('/checkout');
  }

  let parsedTotal = total;
  if (shippingInfo !== null && shippingInfo.cost) {
    parsedTotal = shippingInfo.cost + total;
  }
  return (
    <div className='cart'>
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
                      <span className='ctw-remove' onClick={() => removeHandler(cartItem)}>
                        Remove
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <p id='cart-is-empty'>Shopping bag is empty :(</p>
            )}
          </table>
        </div>
        <div className='cart__wrapper__right'>
          <div className='cart__wrapper__right__info'>
            <table>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>${total}</td>
                </tr>
                <tr>
                  <td>Shipping</td>
                  <td>
                    <select onChange={deliveryHandler}>
                      <option value='Standard Pick Up Point'>Standard Pick Up Point</option>
                      <option value='Express Delivery'>Express Delivery</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Promocode</td>
                  <td>
                    <input
                      disabled={disabled}
                      onChange={promoHandler}
                      id='promocode'
                      type='text'
                      placeholder='Promotion code'
                    />
                  </td>
                </tr>
                <tr>
                  <td>Order total</td>
                  <td>${parsedTotal}</td>
                </tr>
              </tbody>
            </table>
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
