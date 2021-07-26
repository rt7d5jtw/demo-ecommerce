import * as React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import { selectCategories } from '../../category/categorySlice';
import { useSelector } from 'react-redux';
import { IoMdMenu } from 'react-icons/io';
import { useState, useRef, useEffect } from 'react';

const Sidebar = (): JSX.Element => {
  const categories = useSelector(selectCategories);
  const [isOpen, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: Event) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.addEventListener('click', handleClickOutside, true);
    };
  }, []);
  return (
    <div ref={menuRef} className={isOpen ? 'sidebar' : 'sidebar-closed'}>
      <div className='sidebar-links'>
        <IoMdMenu
          className={isOpen ? 'close-btn' : 'close-btn-closed'}
          onClick={() => setOpen(!isOpen)}
        />
        <h1>Chocolatiste</h1>
        {categories.map(({ cname, id }) => (
          <Link to={'/products/' + cname} href={cname} key={id} onClick={() => setOpen(!isOpen)}>
            {cname}
          </Link>
        ))}
      </div>
      <div
        className={isOpen ? 'flat' : 'flat-closed'}
        style={isOpen ? { width: `70.7%` } : { width: `1%` }}
        onClick={() => setOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
