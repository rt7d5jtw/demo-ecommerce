import * as React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/user/selectors';

import Homepage from '../pages/homepage/homepage.component';
import Classics from '../pages/classics/classics.component';
import { Register } from '../features/user/register/register.component';
import { Login } from '../features/user/login/login.component';
import AdminControls from '../features/admin/admin-control/admin-controls.component';
import ProfileDashboard from '../features/user/profile-dashboard/profile-dashboard.component';
import AdminDashboard from '../features/admin/admin-dashboard/admin-dashboard.component';

const App = (): JSX.Element => {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <>
      <Switch>
        <Route exact path='/login' render={() => (currentUser ? <Redirect to='/' /> : <Login />)} />
        <Route
          path='/register'
          component={() => (currentUser ? <Redirect to='/' /> : <Register />)}
        />
        <Route path='/profile' component={ProfileDashboard} />
        <Route path='/admin-controls' component={AdminControls} />
        <Route path='/admin-page' component={AdminDashboard} />
        <Route path='/classics' component={Classics} />
        <Route path='/' component={Homepage} />
      </Switch>
    </>
  );
};

export default App;
