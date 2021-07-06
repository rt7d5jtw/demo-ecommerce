import * as React from 'react';
import './single-product.css';
import { useAppSelector } from '../../app/hooks';
import { selectItems } from '../../features/product/selectors';
import { useParams, useRouteMatch } from 'react-router';
import { IProduct } from '../../features/product/productSlice';

export const SingleProductPage = (): JSX.Element => {
  const match = useRouteMatch();
  React.useEffect(() => {
    console.log(match);
    //console.group('This is product =>', products.find((book: IProduct) => book.id === castedBookId))
  });

  const { bookId } = useParams<{ bookId?: string }>();
  const castedBookId = Number(bookId); // convert to Number

  const products = useAppSelector(selectItems);
  const product = products.find((book: IProduct) => book.id === castedBookId);
  return (
    <div className='single-product'>
      <div className='single-product__col-1'>
        <div
          className='single-product__col-1__image'
          style={{ backgroundImage: `url(${product?.image})` }}
        ></div>
        <div className='single-product__col-1__info'>
          <h1>Author: {product?.author}</h1>
          <h1>Book: {product?.title}</h1>
          <h1>${product?.price}</h1>
          <button className='' onClick={() => console.log(product)}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className='single-product__col-2'>
        <p>{product?.description}</p>
      </div>
    </div>
  );
};
