import * as React from 'react';
import './App.css';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { selectCurrentUser } from './redux/user/user.selectors';

// pages
import Homepage from './pages/homepage/homepage.component';
import { NewReleases } from './pages/new_releases/new_releases.component';
import { AuthorizationPage } from './pages/authorization/authorization.component';
import { AuthenticationPage } from './pages/authentication/authentication.component';
import SearchPage from './pages/search-result/search-result.component';
import Checkout from './pages/checkout/checkout.component';
import Classics from './pages/classics/classics.component';
import AdminPage from './pages/admin-page/admin-page.component';
import AdminCreatorPage from './pages/admin-creator-page/admin-creator-page.component';
import ProfilePage from './pages/profile-page/profile-page.component';
import CategoryPage from './pages/category-page/category-page.component';

const App = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { path } = useRouteMatch();
  return (
    <div className='scroller'>
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route path={`${path}/:categoryId`} component={CategoryPage} />
        <Route path='/admin-page' component={AdminPage} />
        <Route path='/profile' component={ProfilePage} />
        <Route path='/admin-creator' component={AdminCreatorPage} />
        <Route path='/new' component={NewReleases} />
        <Route path='/classics' component={Classics} />
        <Route path='/search-result' component={SearchPage} />
        <Route exact path='/checkout' component={Checkout} />
        <Route path='/register' component={() => currentUser ? (<Redirect to="/" />) : (<AuthorizationPage />)} />
        <Route exact path='/login' render={() => currentUser ? (<Redirect to="/" />) : (<AuthenticationPage />)} />
      </Switch>
    </div>
  );
}

export default connect()(App);
