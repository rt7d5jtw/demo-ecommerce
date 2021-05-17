import * as React from 'react';
import './product-card.css';
import { connect } from 'react-redux';
import { RootState } from '../../redux/root-reducer';
import { addItem } from '../../redux/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { CartItem, Product } from '../../redux/types';
import { createStructuredSelector } from 'reselect';
import { selectCartItems } from '../../redux/cart/cartSlice';
import { useHistory, useParams } from 'react-router';

export interface IProductCard {
  CartItems: Array<CartItem>;
}

const ProductCard = (item: Product) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const params = useParams<{ categoryId?: string }>();
  const cart_item: CartItem = {
    title: '',
    quantity: 1,
    price: 0,
    image: '',
    id: '',
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

const mapStateToProps = createStructuredSelector<RootState, any>({
  cartItems: selectCartItems,
});

export default connect(mapStateToProps)(ProductCard);
