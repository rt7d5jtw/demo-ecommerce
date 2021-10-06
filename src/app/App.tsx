import * as React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, selectRole } from '../features/user/selectors';

const Homepage = React.lazy(() => import('../pages/homepage/homepage.component'));
const Register = React.lazy(() => import('../features/user/register/register.component'));
const Login = React.lazy(() => import('../features/user/login/login.component'));
const Checkout = React.lazy(() => import('../pages/checkout/checkout.component'));
const AdminDashboard = React.lazy(
  () => import('../features/admin/admin-dashboard/admin-dashboard.component')
);
const ProfileDashboard = React.lazy(
  () => import('../features/user/profile-dashboard/profile-dashboard.component')
);
const StripeOrderWrapper = React.lazy(
  () => import('../pages/stripe-order-wrapper/stripe-order-wrapper.component')
);

import { selectMessage } from '../features/alert/alertSlice';
import { Loading } from '../pages/loading/loading.component';
import Alert from '../features/alert/alert/alert.component';
import ErrorBoundary from '../app/error-boundary.component';

const App = (): JSX.Element => {
  const accessToken = useSelector(selectAccessToken);
  const role = useSelector(selectRole);
  const alertMessage = useSelector(selectMessage);

  return (
    <>
      <React.Suspense fallback={<Loading />}>
        {alertMessage.length > 0 ? <Alert /> : null}
        <Switch>
          <ErrorBoundary>
            <Route
              exact
              path='/login'
              render={() => (accessToken ? <Redirect to='/' /> : <Login />)}
            />
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
                (accessToken && role === 'ADMIN') || (accessToken && role === 'GUEST') ? (
                  <AdminDashboard />
                ) : (
                  <Redirect to='/' />
                )
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
          </ErrorBoundary>
        </Switch>
      </React.Suspense>
    </>
  );
};

export default App;
