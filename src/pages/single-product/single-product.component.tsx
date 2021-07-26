import * as React from 'react';
import './single-product.css';
import { useAppSelector } from '../../app/hooks';
import { selectItems } from '../../features/product/selectors';
import { useParams } from 'react-router';
import { IProduct } from '../../features/product/productSlice';

export const SingleProductPage = (): JSX.Element => {
  const products = useAppSelector(selectItems);
  const { productId } = useParams<{ productId: string }>();
  const cId = Number(productId); // convert to Number
  const product = products && products ? products.find((book: IProduct) => book.id === cId) : null;
  return (
    <div className='single-product'>
      <img
        className='single-product__col-1'
        src={require(`../../assets/${product && product.image}`)}
      />
      <div className='single-product__col-2'>
        <div className='single-product__col-2__header'>
          <div className='single-product__col-2__header__left'>
            <h1 id='p-title'>{product?.title}</h1>
            <h1>${product?.price}</h1>
            <p className='single-product__col-2__header__pstatus'>{product?.status}</p>
          </div>
          <div className='single-product__col-2__header__right'>
            <h2>ID: {product?.id}</h2>
          </div>
        </div>
        <div className='single-product__col-2__main'>
          <h2>Description</h2>
          <p>{product?.description}</p>
        </div>
        <div className='single-product__col-2__footer'>
          <p>Quantity</p>
          <select>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
          <button className='' onClick={() => console.log(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
