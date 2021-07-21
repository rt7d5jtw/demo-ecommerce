import * as React from 'react';
import './single-product.css';
import { useAppSelector } from '../../app/hooks';
import { selectItems } from '../../features/product/selectors';
import { useParams } from 'react-router';
import { IProduct } from '../../features/product/productSlice';

export const SingleProductPage = (): JSX.Element => {
  const products = useAppSelector(selectItems);
  const { productId } = useParams<{ productId: string }>();

  React.useEffect(() => {
    console.log(cId);
    console.log(product);
  });

  const cId = Number(productId); // convert to Number
  const product = products && products ? products.find((book: IProduct) => book.id === cId) : null;
  return (
    <div className='single-product'>
      <div
        className='single-product__col-1'
        style={{ backgroundImage: `url(${product && product.image})` }}
      />
      <div className='single-product__col-2'>
        <h1>{product?.title}</h1>
        <h1>${product?.price}</h1>
        <button className='' onClick={() => console.log(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};
