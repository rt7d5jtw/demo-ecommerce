import * as React from 'react';
import './App.css';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/user/selectors';

// pages
import Homepage from '../pages/homepage/homepage.component';
import Classics from '../pages/classics/classics.component';
import AdminPage from '../pages/admin-page/admin-page.component';
import AdminCreatorPage from '../pages/admin-creator-page/admin-creator-page.component';
import ProfilePage from '../pages/profile-page/profile-page.component';
import { Register } from '../features/user/register/register.component';
import { Login } from '../features/user/login/login.component';

const App = (): JSX.Element => {
  const currentUser = useSelector(selectCurrentUser);
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact path='/login' render={() => (currentUser ? <Redirect to='/' /> : <Login />)} />
        <Route
          path='/register'
          component={() => (currentUser ? <Redirect to='/' /> : <Register />)}
        />
        <Route path='/profile' component={ProfilePage} />
        <Route path='/admin-creator' component={AdminCreatorPage} />
        <Route path='/admin-page' component={AdminPage} />
        <Route path='/classics' component={Classics} />
        <Route path='/' component={Homepage} />
      </Switch>
    </>
  );
};

export default App;
