import * as React from 'react';
import './product-card.css';
import { addItem, productToCartItem } from '../../cart/cartSlice';
import { addItemDB } from '../../cart/thunks';
import { useDispatch } from 'react-redux';
import { IProductCard } from '../../../features/product/productSlice';
import { useHistory, useParams } from 'react-router';
import { GiShoppingBag } from 'react-icons/gi';

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
      <span className='product-card__title'>
        <p>{product.title}</p>
        <p>${product.price}</p>
        <button className='product-card__card-button' onClick={buttonHandler}>
          <GiShoppingBag />
        </button>
      </span>
    </div>
  );
};

export default ProductCard;
