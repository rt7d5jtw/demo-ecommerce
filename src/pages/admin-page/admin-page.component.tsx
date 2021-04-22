import * as React from 'react';
import './admin-page.css';
import { RootState } from '../../redux/root-reducer';
import { useHistory, Link, Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserViewer } from '../../components/user-viewer/user-viewer.component';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectUsers } from '../../redux/user/user.selectors';
import { listUsers } from '../../redux/user/user.actions';
import { IUser } from '../../redux/types';
import { createStructuredSelector } from 'reselect';
import { selectOrders } from '../../redux/order/order.selectors';
import { fetchAllOrders } from '../../redux/order/order.actions';
import { OrderCard } from '../../components/order-card/order-card.component';
import { useForm } from 'react-hook-form';
import { selectCategories } from '../../redux/category/category.selectors';
import { fetchCategories, removeCategory } from '../../redux/category/category.actions';
import { CategoryDelete } from '../admin/category/category-delete.component';
import { Stepper } from '../admin/admin-stepper.component';

export const AdminPage = () => {
  const [page, setPage] = useState('overview');
  const { push } = useHistory();

  function ConditionalPaging() {
    switch (page) {
      case 'overview':
        return <AdminOverview />;
      case 'products':
        return <ProductFunctions/>;
      case 'category':
        return <CategoryFunctions/>;
      case 'orders':
        return <ViewOrders/>;
      case 'users':
        return <ViewUsers/>;
      default:
        return <AdminOverview />;
    }
  }

  return (
    <div className='admin-page'>
      <div className='admin-information'>
        <div className='admin-header'>
          <Link to='/'>
            <h1 className='store-name'>	&larr; Bookstore</h1>
          </Link>
          <h1>Administration</h1>
        </div>
        <div className='admin-nav'>
          <div className='admin-nav-wrapper'>
            <h1 onClick={() => setPage('overview')}>Admin Overview</h1>
            <h1 onClick={() => setPage('products')}>Product CRUD</h1>
            <h1 onClick={() => setPage('category')}>Category CRUD</h1>
            <h1 onClick={() => setPage('orders')}>View orders</h1>
            <h1 onClick={() => setPage('users')}>View users</h1>
          </div>
        </div>
        <div className='admin-main'>
          <ConditionalPaging />
        </div>
      </div>
    </div>
  );
}

const AdminOverview = () => {
  return (
    <div className='admin-overview'>
      <div className='admin-overview-wrapper'>
        <div className='admin-image' style={{backgroundImage:`url('https://i.imgur.com/m6D6BSl.png')`}}>
          <div className='text-overlay'>
          <h1 className='welcome-text'>Welcome to Administration</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductFunctions = () => {
  return (
    <div className='profile-admin'>
      <div className='admin-overview-wrapper'>
        <h1>Create a product</h1>
        <form className='admin-form'>
          <label>Product name</label>
          <input type="text" placeholder="Product name" />
          <label>Product price</label>
          <input type="text" placeholder="Product price" />
          <label>Product author</label>
          <input type="text" placeholder="Product author" />
          <label>Product category</label>
          <input type="text" placeholder="Product category" />
          <label>Product description</label>
          <textarea id="product-desc" name="description"></textarea>
        </form>
      </div>
    </div>
  );
}

const CategoryFunctions = () => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    dispatch(removeCategory(data.categories));
    location.reload()
  };

  return (
    <div className='profile-admin'>
      <div className='admin-category-wrapper'>
        <h1 id='category-title'>Category functions</h1>
        <Stepper />
        <CategoryDelete />
    {/*

        <div className='form-wrapper'>
          <form className='admin-form'>
            <label>Catetgory name</label>
            <input type="text" placeholder="Category name" />
            <button type="button">Create</button>
          </form>

          <form className='admin-form' onSubmit={handleSubmit(onSubmit)}>
            <label>Delete a category</label>
              <select ref={register} name="categories" id="categories">
                {categories.map(({ id, cname }) => (
                  <option value={id} key={id}>{cname}</option>
                ))}
              </select>
              <button type="submit">Delete</button>
          </form>
        </div>
       */}
      </div>
    </div>
  );
}


const ViewOrders = () => {
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])
  return (
    <div className='admin-overview'>
      <div className='admin-myorders-wrapper'>
        <h1 id='browse-orders'>Browse orders</h1>
        <div className='admin-order-wrapper'>
      {orders.map(({ id, date, ...props }) => (
        <OrderCard key={id} id={id} date={date} { ...props } />
      ))}
        </div>
      </div>
    </div>

  );
}

const ViewUsers = () => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listUsers())
  }, [dispatch])

  return (
    <div className='admin-overview'>
      <div className='admin-myusers-wrapper'>
        <h1 id='browse-users'>Browse users</h1>
        <div className='user-wrapper'>
          {users.map(({ id, createdAt, ...props }) => (
            <UserViewer key={id} id={id} date={createdAt} { ...props } />
          ))}
        </div>
      </div>
    </div>
  );
}
