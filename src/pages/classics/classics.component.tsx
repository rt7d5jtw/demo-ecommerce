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
import { MultipleSelectForm, parseFormJSON, TestForm } from '../../features/forms/testform';
import FormDataState from './fields.data';
import { selectCategories } from '../../features/category/categorySlice';
import { Paginator } from '../../features/forms/paginator';
import { handleForm } from '../../features/forms/utils/utils';

interface IClassics {
  message: string;
}

const Classics = () => {
  const dispatch = useDispatch();
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(handleForm(e.currentTarget.elements));
  }
  function onChange(e: React.ChangeEvent) {
    console.log(e.target);
  }
  return (
    <div className='classics'>
      <button onClick={() => dispatch(assignRole())}>ROLE</button>
      <div className='something'>
        <form onSubmit={onSubmit}>
          <select onChange={onChange} name='cars' id='cars' multiple>
            <option value='volvo'>Volvo</option>
            <option value='saab'>Saab</option>
            <option value='opel'>Opel</option>
            <option value='audi'>Audi</option>
          </select>
          <input type='submit' value='submit' />
        </form>
        <TestForm
          onSubmit={onSubmit}
          submitlabel='Submit'
          headlabel='Testing new form'
          fields={{
            labels: [
              {
                orderIdentifier: 1,
                label: 'Testing new form',
                htmlFor: 'categoryIds',
              },
            ],
            input: [
              {
                orderIdentifier: 2,
                type: 'text',
                name: 'title',
                id: 'title',
                placeholder: 'Product title',
                title: 'You must specify a title',
                maxLength: 256,
                minLength: 3,
                required: true,
              },
            ],
            multiselect: [
              {
                orderIdentifier: 2,
                label: 'Testing',
                form: 'badumts-form',
                name: 'categoryIds',
                id: 'categoryIds',
                required: true,
                options: [
                  { value: 'Apple', id: 'Apple', label: 'Apple' },
                  { value: 'Orange', id: 'Orange', label: 'Orange' },
                  { value: 'Grapes', id: 'Grapes', label: 'Grapes' },
                  { value: 'Berry', id: 'Berry', label: 'Berry' },
                  { value: 'Mango', id: 'Mango', label: 'Mango' },
                  { value: 'Tomato', id: 'Tomato', label: 'Tomato' },
                ],
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, IClassics>({
  message: selectMessage,
});

export default connect(mapStateToProps)(Classics);
