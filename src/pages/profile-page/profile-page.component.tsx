import * as React from 'react';
import './profile-page.css';
import { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Inputs } from '../../components/register/register.component';
import { useHistory, Link } from 'react-router-dom';
import { OrderCard } from '../../components/order-card/order-card.component';

export const ProfilePage = () => {
  const [page, setPage] = useState('overview');
  const { push } = useHistory();

  function ConditionalPaging() {
    switch (page) {
      case 'overview':
        return <ProfileOverview />;
      case 'orders':
        return <MyOrders />;
      case 'password':
        return <ChangePassword />;
      case 'email':
        return <ChangeEmail />;
      case 'details':
        return <ChangeDetails />;
      default:
        return <ProfileOverview />;
    }
  }

  return (
  <div className='profile-page'>
    <div className='profile-information'>
      <div className='profile-header'>
        <Link to='/'>
          <h1 className='store-name'>	&larr; Bookstore</h1>
        </Link>
        <h1>My Profile</h1>
      </div>
      <div className='profile-nav'>
        <div className='profile-nav-wrapper'>
          <h1 onClick={() => setPage('overview')}>Profile Overview</h1>
          <h1 onClick={() => setPage('orders')}>My Orders</h1>
          <h1 onClick={() => setPage('password')}>Change Password</h1>
          <h1 onClick={() => setPage('email')}>Change Email</h1>
          <h1 onClick={() => setPage('details')}>Change Details</h1>
        </div>
      </div>
      <div className='profile-main'>
        <ConditionalPaging />
      </div>
    </div>
  </div>
  );
}

const ProfileOverview = () => {
  return (
    <div className='profile-overview'>
      <div className='profile-overview-wrapper'>
        <div className='profile-image' style={{backgroundImage:`url('https://i.imgur.com/BUl15mr.png')`}}>
          <h1 className='welcome-text'>Welcome to your profile</h1>
        </div>
      </div>
    </div>
  );
}

const MyOrders = () => {
  return (
    <div className='profile-overview'>
      <div className='profile-myorders-wrapper'>
        <h1>Browse your orders</h1>
        <div className='order-wrapper'>
          <OrderCard image={'https://i.imgur.com/yadQN6X.png'} title={'WD Watch'} ordernum={'114a42d6-3acf-4694-a03b-a774674fa7a9'} date={'16-4-2021'}/>
        </div>
      {/*
      {orders.map(({ id, ...props }) => (
        <CartItem key={id} id={id} { ...props } />
      ))}
      */}
      </div>
    </div>

  );
}

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data)

    if (user.email && user.password) {
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(user => ({ ...user, [name]: value }));
  }

  return (
    <div className='profile-overview'>
      <div className='profile-overview-wrapper'>
        <div className='profile-password'>
          <h1>Change my password</h1>
          <form className='profile-form'>
          <label>Current Password</label>
            <input
              type="password"
              name="password"
              placeholder="Current password"
              required
            />
            {errors?.email && <p className='profile-text'>{errors.email.message}</p>}
            <div>
            <label>New Password</label>
              <input
                type="password"
                name="password"
                placeholder="New password"
              />
            {errors?.password && <p className='profile-text'>{errors.password.message}</p>}
            </div>

            <button type="button" onClick={handleSubmit(onSubmit)}>Save Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const ChangeEmail = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data)

    if (user.email && user.password) {
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(user => ({ ...user, [name]: value }));
  }

  return (
    <div className='profile-overview'>
      <div className='profile-overview-wrapper'>
        <div className='profile-password'>
          <h1>Change my email</h1>
          <form className='profile-form'>
          <label>Current Email</label>
            <input
              type="password"
              name="password"
              placeholder="Current email"
              required
            />
            {errors?.email && <p className='profile-text'>{errors.email.message}</p>}
            <div>
            <label>New Email</label>
              <input
                type="password"
                name="password"
                placeholder="New email"
              />
            {errors?.password && <p className='profile-text'>{errors.password.message}</p>}
            </div>

            <button type="button" onClick={handleSubmit(onSubmit)}>Save Email</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const ChangeDetails = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data)

    if (user.email && user.password) {
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(user => ({ ...user, [name]: value }));
  }

  return (
    <div className='profile-overview'>
      <div className='profile-details-wrapper'>
        <div className='profile-password'>
          <h1>Change my details</h1>
          <form className='profile-form'>
          <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="New address"
              required
            />
            {errors?.email && <p className='profile-text'>{errors.email.message}</p>}
            <div>
            <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="New name"
              />
            {errors?.password && <p className='profile-text'>{errors.password.message}</p>}
            </div>

            <button type="button" onClick={handleSubmit(onSubmit)}>Save Details</button>
          </form>
        </div>
      </div>
    </div>
  );
}

