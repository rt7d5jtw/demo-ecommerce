import * as React from 'react';
import './dropdown.css';

const DropdownMenu = (): JSX.Element => {
  const [isChecked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked(!isChecked);
  };

  return (
    <div className='new-dropdown'>
      <nav>
        <h2 onClick={handleChange}>Drop Down Menu</h2>
        <ul style={isChecked ? { height: '100%' } : {}}>
          <li>
            <a href='#'>Section 01</a>
          </li>
          <li>
            <a href='#'>Section 02</a>
          </li>
          <li>
            <a href='#'>Section 03</a>
          </li>
          <li>
            <a href='#'>Section 04</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DropdownMenu;
