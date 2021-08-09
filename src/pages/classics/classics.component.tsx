import * as React from 'react';
import './classics.css';
import Alert from '../../features/alert/alert/alert.component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { userLogged, registered, selectMessage } from '../../features/alert/alertSlice';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { assignRole } from '../../features/user/thunks';
import { clearErrors, clearShippingInfo } from '../../features/user/userSlice';
import { CART_URL, createCart, fetchCart } from '../../features/cart/api';
import { authHeader, fetchRole } from '../../features/user/api';
import axios from 'axios';
import { AdminDropdown } from '../../features/admin/admin-dropdown/admin-dropdown.component';
import { fetchOrderItems } from '../../features/order/api';
import { fetchItems } from '../../features/order/thunks';
import { parseFormJSON, TestForm } from '../../features/forms/testform';
import FormDataState from './fields.data';
import { selectCategories } from '../../features/category/categorySlice';
import { Paginator } from '../../features/forms/paginator';
import { mockdata } from './mockdata';

interface IClassics {
  message: string;
}

const Classics = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [add, setAdd] = React.useState({
    count: 0,
  });
  function onSubmit(e: any) {
    console.log(e);
  }
  const [currentPage, setCurrentPage] = React.useState(0);
  const data = React.useMemo(() => {
    const firstPage = currentPage * 10;
    const lastPage = firstPage + 10;
    return mockdata.slice(firstPage, lastPage);
  }, [currentPage]);
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
      <button className='cl-btn' onClick={() => console.log(dispatch(clearShippingInfo()))}>
        clear Shipping info
      </button>
      <button className='cl-btn' onClick={() => console.log(dispatch(clearErrors()))}>
        clearErrors
      </button>
      <button
        className='cl-btn'
        onClick={() => console.log(dispatch(fetchItems('96a94bbc-c18c-41a0-94c7-77320815c577')))}
      >
        fetch order items
      </button>
      <div className='something'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Paginator
          totalItems={mockdata.length}
          elementsPerPage={10}
          currentPage={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
