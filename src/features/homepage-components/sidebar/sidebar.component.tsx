import * as React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectCategories } from '../../category/categorySlice';
import { RootState } from '../../../app/store';
import { Category } from '../../../features/category/categorySlice';
import { connect } from 'react-redux';
import { AiOutlineMenu } from 'react-icons/ai';
import { useState, useRef, useEffect } from 'react';

interface ISidebar {
  categories: Category[];
}

const Sidebar = ({ categories }: ISidebar) => {
  const handleClickOutside = (event: Event) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActive(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.addEventListener('click', handleClickOutside, true);
    };
  }, []);
  const [isActive, setActive] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleClass = () => setActive(!isActive);
  return (
    <div ref={menuRef} className={isActive ? 'sidebar' : 'sidebar-closed'}>
      <div className='sidebar-links'>
        <AiOutlineMenu
          className={isActive ? 'close-btn' : 'close-btn-closed'}
          onClick={toggleClass}
        />
        <h1>Bookstore</h1>
        {categories.map(({ cname, id }) => (
          <Link to={'/books/' + cname} href={cname} key={id}>
            {cname}
          </Link>
        ))}
      </div>
    </div>
  );
};

interface IMapStateToProps {
  categories: Category[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  categories: selectCategories,
});

export default connect(mapStateToProps)(Sidebar);
