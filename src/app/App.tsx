import * as React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, selectRole } from '../features/user/selectors';

import Homepage from '../pages/homepage/homepage.component';
import { Register } from '../features/user/register/register.component';
import { Login } from '../features/user/login/login.component';
import AdminDashboard from '../features/admin/admin-dashboard/admin-dashboard.component';
import ProfileDashboard from '../features/user/profile-dashboard/profile-dashboard.component';
import Checkout from '../pages/checkout/checkout.component';
import { StripeOrderWrapper } from '../pages/stripe-order-wrapper/stripe-order-wrapper.component';

const App = (): JSX.Element => {
  const accessToken = useSelector(selectAccessToken);
  const role = useSelector(selectRole);
  return (
    <>
      <Switch>
        <Route exact path='/login' render={() => (accessToken ? <Redirect to='/' /> : <Login />)} />
        <Route
          path='/register'
          component={() => (accessToken ? <Redirect to='/' /> : <Register />)}
        />
        <Route
          path='/profile'
          render={() => (accessToken ? <ProfileDashboard /> : <Redirect to='/' />)}
        />
        <Route
          path='/admin-dashboard'
          render={() =>
            accessToken && role === 'ADMIN' ? <AdminDashboard /> : <Redirect to='/' />
          }
        />
        <Route
          exact
          path='/payment'
          render={() => (accessToken ? <StripeOrderWrapper /> : <Redirect to='/' />)}
        />
        <Route
          exact
          path='/checkout'
          render={() => (accessToken ? <Checkout /> : <Redirect to='/' />)}
        />
        <Route path='/' component={Homepage} />
      </Switch>
    </>
  );
};

export default App;
