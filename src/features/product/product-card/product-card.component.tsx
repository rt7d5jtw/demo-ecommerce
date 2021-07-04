import * as React from 'react';
import './product-card.css';
import { connect } from 'react-redux';
import { RootState } from '../../../app/store';
import { addItem } from '../../cart/cartSlice';
import { addItemDB } from '../../cart/thunks';
import { useDispatch } from 'react-redux';
import { CartItemDto } from '../../../features/cart/cartSlice';
import { IProductCard } from '../../../features/product/productSlice';
import { createStructuredSelector } from 'reselect';
import { selectCartItems } from '../../cart/selectors';
import { useHistory, useParams } from 'react-router';

const ProductCard = (item: IProductCard) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const dispatch = useDispatch();
  const { push } = useHistory();
  const params = useParams<{ categoryId?: string }>();
  // make some new dto like CartItemNewItemDto
  const cartItem: any = {
    title: null,
    quantity: 1,
    price: null,
    image: null,
    productId: null,
  };

  const buttonHandler = () => {
    /* copying an object into new CartItem from the ProductCard */
    cartItem.title = item.title;
    cartItem.price = item.price;
    cartItem.image = item.image;
    cartItem.quantity = 1;
    cartItem.productId = item.id;

    dispatch(addItem(cartItem));
    if (user && user.accessToken) {
      dispatch(addItemDB(item.id));
    } else {
      console.log('User doesnt exists');
    }
  };

  return (
    <div className='card'>
      <div
        className='image'
        style={{ backgroundImage: `url(${item.image})` }}
        onClick={() => push(`${params.categoryId}/${item.id}`)}
      >
        <div className='opacity-wrapper' />
        <div className='info-wrapper'></div>
      </div>
      <div className='card-bottom'>
        <span className='price'>${item.price}</span>
        <button className='card-button' onClick={buttonHandler}>
          Add to Cart
        </button>
      </div>
      <span className='title'>{item.title}</span>
    </div>
  );
};

interface IMapStateToProps {
  cartItems: CartItemDto[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  cartItems: selectCartItems,
});

export default connect(mapStateToProps)(ProductCard);
