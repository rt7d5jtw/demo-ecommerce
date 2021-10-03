import * as React from 'react';
import './profile-drop.css';
import { CgProfile } from 'react-icons/cg';
import { logout } from '../../user/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectRole } from '../../user/selectors';

export const ProfileDropdown = (): JSX.Element => {
  const authorized = useSelector(selectRole);
  const [isChecked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked(!isChecked);
  };
  const dispatch = useDispatch();
  return (
    <div className='profile-dropdown'>
      <nav data-cy='profile-nav' onMouseEnter={handleChange} onMouseLeave={handleChange}>
        <i>
          <CgProfile />
        </i>
        <ul
          data-cy='profile-ul'
          id='profile-ul'
          style={isChecked ? { height: '320px', width: '200px' } : {}}
        >
          <li>
            <Link data-cy='profile-link' to='/profile'>
              Profile
            </Link>
          </li>
          {authorized === 'ADMIN' || authorized === 'GUEST' ? (
            <li>
              <Link data-cy='admin-link' to='/admin-dashboard'>
                Admin
              </Link>
            </li>
          ) : null}
          <li>
            <a onClick={() => dispatch(logout())}>Logout</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
