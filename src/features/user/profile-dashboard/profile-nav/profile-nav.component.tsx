import * as React from 'react';
import './profile-nav.css';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  name: string;
}

type MatchProps = RouteComponentProps<MatchParams>;

function ProfileNav({ match }: MatchProps) {
  return (
    <div className='profile-nav'>
      <div className='profile-nav-wrapper'>
        <Link to={`${match.url}/profile-overview`} className='nav-element'>
          Profile Overview
        </Link>
        <Link to={`${match.url}/my-orders`} className='nav-element'>
          My Orders
        </Link>
        <Link to={`${match.url}/change-password`} className='nav-element'>
          Change Password
        </Link>
        <Link to={`${match.url}/change-email`} className='nav-element'>
          Change Email
        </Link>
      </div>
    </div>
  );
}

export default withRouter(ProfileNav);
