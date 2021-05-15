import * as React from 'react';
import './single-product.css';
import { useSelector } from 'react-redux';
import { selectProductItems } from '../../redux/product/product.selectors';
import { useParams } from 'react-router';
import { ProductwithID } from '../../redux/types';

interface ISingleProductPage {
  match?: string;
}

export const SingleProductPage = ({ match }: ISingleProductPage): JSX.Element => {
  const { bookId } = useParams<{ bookId?: string }>();
  const products = useSelector(selectProductItems);
  const product = products.find((book: ProductwithID) => book.id === parseInt(bookId, 10));
  return (
    <div className='single-product'>
      <div className='product-col-1'>
        <div className='product-image' style={{ backgroundImage: `url(${product.image})` }}></div>
        <div className='product-col-1__col'>
          <h1>Author: {product.author}</h1>
          <h1>Book: {product.title}</h1>
          <h1>${product.price}</h1>
          <button className='card-button' onClick={() => console.log(product)}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className='product-col-2'>
        <p>{product.description}</p>
      </div>
    </div>
  );
};
