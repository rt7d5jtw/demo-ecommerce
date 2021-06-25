import * as React from 'react';
import './single-product.css';
import { useAppSelector } from '../../app/hooks';
import { selectItems } from '../../features/product/selectors';
import { useParams } from 'react-router';
import { Product } from '../../features/product/productSlice';

export const SingleProductPage = (): JSX.Element => {
  const { bookId } = useParams<{ bookId?: string }>();
  const products: Product[] = useAppSelector(selectItems);
  const product = products.find((book: Product) => book.id === parseInt(bookId, 10));
  return (
    <div className='single-product'>
      <div className='product-col-1'>
        <div className='product-image' style={{ backgroundImage: `url(${product?.image})` }}></div>
        <div className='product-col-1__col'>
          <h1>Author: {product?.author}</h1>
          <h1>Book: {product?.title}</h1>
          <h1>${product?.price}</h1>
          <button className='card-button' onClick={() => console.log(product)}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className='product-col-2'>
        <p>{product?.description}</p>
      </div>
    </div>
  );
};
