import * as React from 'react';
import './classics.css';
import Alert from '../../features/alert/alert/alert.component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  userLogged,
  registered,
  selectMessage,
  promoAdded,
  paymentSuccess,
} from '../../features/alert/alertSlice';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { fetchAll, fetch as fetchOrders } from '../../features/order/thunks';
import {
  fetchRole,
  fetchAllUsers,
  register,
  updatePassword,
  updateEmail,
  login,
} from '../../features/user/api';
import { assignRole } from '../../features/user/thunks';
import { clearErrors, clearShippingInfo } from '../../features/user/userSlice';
import { fetchProducts, removeProduct } from '../../features/product/api';
import { addOrderItems, getInvoice, removeOrder, updateOrder } from '../../features/order/api';
import { checkIfCart, createCart, fetchCart, fetchCartState } from '../../features/cart/api';
import { fetchState } from '../../features/cart/thunks';
import { clearPromotions, IPromotions } from '../../features/promotion/promotionSlice';
import { clearProducts } from '../../features/product/productSlice';
import { fetchCategories } from '../../features/category/api';
import DropdownMenu from '../../features/homepage-components/dropdown/dropdown.component';
import { ProfileDropdown } from '../../features/homepage-components/dropdown/profile-drop.component';
import { selectPromotionItems } from '../../features/promotion/selectors';
import { fetchPicture } from '../../features/promotion/api';
import { OrderStatus } from '../../features/order/orderSlice';

interface IClassics {
  message: string;
}

const Classics = () => {
  const dispatch = useDispatch();
  const [isChecked, setChecked] = React.useState(false);
  const promotions = useSelector(selectPromotionItems);

  React.useEffect(() => {
    console.group('promotions =>', promotions);
  });

  const handleChange = () => {
    setChecked(!isChecked);
  };

  async function handleStuff() {
    new Promise((resolve) => {
      console.log('Calling...');
      resolve('Resolved');
    })
      .then(() => {
        return dispatch(promoAdded());
      })
      .then(() => {
        setTimeout(() => console.log('Promotion succesful'), 2000);
        setTimeout(() => dispatch(paymentSuccess()), 2000);
      })
      .then(() => setTimeout(() => console.log('Complete'), 2000));
  }

  return (
    <div className='classics'>
      <Alert />
      <button className='cl-btn' onClick={() => dispatch(userLogged())}>
        Log in alert
      </button>
      <button className='cl-btn' onClick={() => dispatch(registered())}>
        Register aler
      </button>
      <button className='cl-btn' onClick={() => console.log(dispatch(assignRole()))}>
        get role
      </button>
      <button className='cl-btn' onClick={() => console.log(fetchCartState())}>
        fetch cart state
      </button>
      <button className='cl-btn' onClick={() => console.log(dispatch(clearShippingInfo()))}>
        clear Shipping info
      </button>
      <button className='cl-btn' onClick={() => console.log(dispatch(clearErrors()))}>
        clearErrors
      </button>
      <button className='cl-btn' onClick={() => console.log(fetchProducts())}>
        fetch products
      </button>
      <button className='cl-btn' onClick={() => fetchPicture('fillbar.jpg')}>
        fetch picture
      </button>
      <button
        className='cl-btn'
        onClick={() =>
          console.log(
            updateOrder('490f374c-b448-4a7b-ad2c-0bedb9fe2163', { status: OrderStatus.PAID })
          )
        }
      >
        update order
      </button>
      <div className='something'>
        <button onClick={handleStuff}>stuff</button>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
