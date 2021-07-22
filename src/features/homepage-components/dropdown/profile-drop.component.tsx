import * as React from 'react';
import './profile-drop.css';
import { CgProfile } from 'react-icons/cg';
import { logout } from '../../user/thunks';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export const ProfileDropdown = (): JSX.Element => {
  const [isChecked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked(!isChecked);
  };
  const dispatch = useDispatch();
  return (
    <div className='profile-dropdown'>
      <nav onMouseEnter={handleChange} onMouseLeave={handleChange}>
        <i>
          <CgProfile />
        </i>
        <ul style={isChecked ? { height: '320px', width: '200px' } : {}}>
          <li>
            <Link to='/profile'>Profile</Link>
          </li>
          <li>
            <Link to='/admin-page'>Admin</Link>
          </li>
          <li>
            <a onClick={() => dispatch(logout())}>Logout</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
