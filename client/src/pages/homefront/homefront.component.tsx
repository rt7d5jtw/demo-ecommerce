import * as React from 'react';
import './homefront.css';
import { Link } from 'react-router-dom';
import background from './../../assets/homefront.jpg';
import { MdKeyboardArrowRight } from 'react-icons/md';

const Homefront = (): JSX.Element => {
  return (
    <div
      className='homefront'
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className='ellipse__container'>
        <div className='ellipse'>
          <div className='ellipse__stuff'>
            <p>Quality chocolates since 1894, made from fresh ingredients</p>
            <Link to='/products/bestsellers' className='ellipse__button'>
              Bestsellers
              <MdKeyboardArrowRight className='ellipse__button__icon' />
            </Link>
            <p>Finest ingredients straight from producers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homefront;
