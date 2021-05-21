import * as React from 'react';
import './product-card.css';
import { connect } from 'react-redux';
import { RootState } from '../../../app/store';
import { addItem, addItemDB } from '../../cart/cartSlice';
import { useDispatch } from 'react-redux';
import { CartItem } from '../../../features/cart/cartSlice';
import { Product } from '../../../features/product/productSlice';
import { createStructuredSelector } from 'reselect';
import { selectCartItems } from '../../cart/cartSlice';
import { useHistory, useParams } from 'react-router';

export type ProductCardValues = Omit<Product, 'category' | 'author' | 'description'>;

const ProductCard = (item: ProductCardValues) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const dispatch = useDispatch();
  const { push } = useHistory();
  const params = useParams<{ categoryId?: string }>();
  const cart_item: CartItem = {
    title: '',
    quantity: 1,
    price: 0,
    image: '',
    id: 0,
  };

  const buttonHandler = () => {
    // parsing the item to a copy
    cart_item.title = item.title;
    cart_item.price = item.price;
    cart_item.image = item.image;
    cart_item.id = item.id;
    //dispatch(addItemToCart(cartItems, cart_item))
    dispatch(addItem(cart_item));
    console.log(cart_item);
    if (user && user.accessToken) {
      dispatch(addItemDB(cart_item.id))
    } else {
      console.log('User doesnt exists')
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
  cartItems: CartItem[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  cartItems: selectCartItems,
});

export default connect(mapStateToProps)(ProductCard);
