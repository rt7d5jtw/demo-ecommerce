import * as React from 'react';
import './classics.css';
import Alert from '../../features/alert/alert/alert.component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { userLogged, registered, selectMessage } from '../../features/alert/alertSlice';
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
import { addOrderItems, getInvoice, removeOrder } from '../../features/order/api';
import { checkIfCart, createCart, fetchCart, fetchCartState } from '../../features/cart/api';
import { fetchState } from '../../features/cart/thunks';
import { clearPromotions, IPromotions } from '../../features/promotion/promotionSlice';
import { clearProducts } from '../../features/product/productSlice';
import { fetchCategories } from '../../features/category/api';
import DropdownMenu from '../../features/homepage-components/dropdown/dropdown.component';
import { ProfileDropdown } from '../../features/homepage-components/dropdown/profile-drop.component';
import { selectPromotionItems } from '../../features/promotion/selectors';

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
      <button className='cl-btn' onClick={() => console.log(fetchCategories())}>
        fetch categories
      </button>
      <button
        className='cl-btn'
        onClick={() => console.log(getInvoice('f29ca6ae-3aac-4794-b008-4d743901a226'))}
      >
        fetch invoice
      </button>
      <div className='something'></div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
