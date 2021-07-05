import * as React from 'react';
import './product-card.css';
import { addItem, productToCartItem } from '../../cart/cartSlice';
import { addItemDB } from '../../cart/thunks';
import { useDispatch } from 'react-redux';
import { IProductCard } from '../../../features/product/productSlice';
import { useHistory, useParams } from 'react-router';

/* CategoryPage component feeds data to ProductCard from props */
const ProductCard = (product: IProductCard): JSX.Element => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const dispatch = useDispatch();
  const { push } = useHistory();
  const params = useParams<{ categoryId?: string }>();

  const buttonHandler = () => {
    /* copying an object into new CartItem from the ProductCard */
    dispatch(addItem(productToCartItem(product)));
    if (user && user.accessToken) {
      dispatch(addItemDB(product.id));
    }
  };

  return (
    <div className='product-card'>
      <div
        className='product-card__image'
        style={{ backgroundImage: `url(${product.image})` }}
        onClick={() => push(`${params.categoryId}/${product.id}`)}
      ></div>
      <div className='product-card__card-bottom'>
        <span className='product-card__price'>${product.price}</span>
        <button className='product-card__card-button' onClick={buttonHandler}>
          Add to Cart
        </button>
      </div>
      <span className='product-card__title'>{product.title}</span>
    </div>
  );
};

export default ProductCard;
