import * as React from 'react';
import './admin-nav.css';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  name: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}


function AdminNav({ match }: MatchProps) {
  return (
    <div className='admin-nav'>
      <div className='admin-nav-wrapper'>
        <Link to={`${match.url}/admin-overview`} className='nav-element'>Admin Overview</Link>
        <Link to='/admin-creator' className='nav-element' title='Create categories and products'>Admin Creator</Link>
        <Link to={`${match.url}/orders`} className='nav-element' title='View all orders made by users'>View orders</Link>
        <Link to={`${match.url}/users`} className='nav-element' title='View all users'>View users</Link>
      </div>
    </div>
  )
}

export default withRouter(AdminNav);
