import * as React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectCurrentUser } from './redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';
import { RootState } from './redux/root-reducer';
import { User } from './redux/types';

// pages
import { Homepage } from './pages/homepage/homepage.component';
import { NewReleases } from './pages/new_releases/new_releases.component';
import { AuthorizationPage } from './pages/authorization/authorization.component';
import { AuthenticationPage } from './pages/authentication/authentication.component';
import Outlet from './pages/outlet/outlet.component';
import SearchPage from './pages/search-result/search-result.component';
import Checkout from './pages/checkout/checkout.component';
import Classics from './pages/classics/classics.component';
import AdminPage from './pages/admin-page/admin-page.component';
import AdminCreatorPage from './pages/admin-creator-page/admin-creator-page.component';
import ProfilePage from './pages/profile-page/profile-page.component';

type AppProp = {
  currentUser: User | null | undefined
}

const App = ({ currentUser }: AppProp) => {
  return (
    <div className='scroller'>
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route path='/admin-page' component={AdminPage} />
        <Route path='/profile' component={ProfilePage} />
        <Route path='/admin-creator' component={AdminCreatorPage} />
        <Route path='/new' component={NewReleases} />
        <Route path='/outlet' component={Outlet} />
        <Route path='/classics' component={Classics} />
        <Route path='/search-result' component={SearchPage} />
        <Route exact path='/checkout' component={Checkout} />
        <Route path='/register' component={() => currentUser ? (<Redirect to="/" />) : (<AuthorizationPage />)} />
        <Route exact path='/login' render={() => currentUser ? (<Redirect to="/" />) : (<AuthenticationPage />)} />
      </Switch>
    </div>
  );
}

const mapStateToProps = createStructuredSelector<RootState, AppProp>({
  currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(App);
