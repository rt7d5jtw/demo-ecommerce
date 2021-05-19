import * as React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectCategories } from '../../category/categorySlice';
import { RootState } from '../../../app/root-reducer';
import { Category } from '../../../app/types';
import { connect } from 'react-redux';

interface ISidebar {
  categories: Category[];
}

const Sidebar = ({ categories }: ISidebar) => {
  return (
    <div className='sidebar'>
      <div className='sidebar-links'>
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
