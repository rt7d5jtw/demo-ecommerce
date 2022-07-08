import * as React from 'react';
import './product-card.css';
import { addItem, productToCartItem } from '../../cart/cartSlice';
import { addItemDB } from '../../cart/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { IProductCard } from '../../../features/product/productSlice';
import { useHistory, useParams } from 'react-router';
import { GiShoppingBag } from 'react-icons/gi';
import { selectAccessToken } from '../../user/selectors';

/* CategoryPage component feeds data to ProductCard from props */
const ProductCard = (product: IProductCard): JSX.Element => {
  const token = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const params = useParams<{ category?: string }>();
  //params && Object.keys(params).length === 0 && params.constructor === Object;

  const buttonHandler = () => {
    /* copying an object into new CartItem from the ProductCard */
    dispatch(addItem(productToCartItem(product)));

    // If user is logged in, send request to database instead.
    // if (token) {
    //   dispatch(addItemDB(product.id));
    // }
  };

  return (
    <div className='product-card'>
      <img
        className='product-card__image'
        src={require(`../../../assets/${product.image}`)}
        onClick={() =>
          push(
            params && Object.keys(params).length === 0 && params.constructor === Object
              ? `products/${product.categories[0].cname}/${product.id}`
              : `${params.category}/${product.id}`
          )
        }
      />
      <span className='product-card__title'>
        <p id='product__title'>{product.title}</p>
        <p>${product.price}</p>
      </span>
      <button className='product-card__card-button' onClick={buttonHandler}>
        <GiShoppingBag />
      </button>
    </div>
  );
};

export default ProductCard;
