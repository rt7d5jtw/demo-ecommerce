import * as React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectCategories } from '../../redux/category/category.selectors';
import { RootState } from '../../redux/root-reducer';
import { Category } from '../../redux/types';
import { connect } from 'react-redux';

interface ISidebar {
  categories: Category[];
}

const Sidebar = ({ categories }: ISidebar) => {
  return (
    <div className='sidebar'>
        <h1>Bookstore</h1>
        {categories.map(({ cname, id }) => (
          <Link to={'/' + cname} href={cname} key={id}>{cname}</Link>
        ))}
        <hr />
        <Link to='/shop' href='shop'>Shop</Link>
        <Link to='/New' href='new'>New Releases</Link>
        <Link to='/Bestsellers' href='bestsellers'>Bestsellers</Link>
        <Link to='/Outlet' href='outlet'>Outlet</Link>
        <Link to='/Fiction' href='fiction'>Fiction</Link>
    </div>
  )
}

interface IMapStateToProps {
  categories: Category[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  categories: selectCategories
})

export default connect(mapStateToProps)(Sidebar);
