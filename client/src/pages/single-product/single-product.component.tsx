import * as React from 'react';
import './single-product.css';
import { useAppSelector } from '../../app/hooks';
import { selectItems } from '../../features/product/selectors';
import { useLocation, useParams } from 'react-router';
import { IProduct } from '../../features/product/productSlice';
import { addItem, productToCartItem } from '../../features/cart/cartSlice';
import { addItemDB } from '../../features/cart/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from '../../features/user/selectors';

const SingleProductPage = (): JSX.Element => {
  const token = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const products = useAppSelector(selectItems);
  const [qty, setQty] = React.useState<number>(1);
  const { productId } = useParams<{ productId: string }>();
  const cId = Number(productId); // convert to Number
  const product =
    products && products
      ? products.find((book: IProduct) => book.id === cId)
      : null;

  function handleQty(e: React.ChangeEvent<HTMLSelectElement>) {
    setQty(Number(e.target.value));
  }

  function addProductHandler(product: IProduct) {
    if (qty != 1) {
      product['quantity'] = qty;
    }
    for (let i = 0; i < qty; i++) {
      dispatch(addItem(productToCartItem(product)));

      // Adds to database if user is logged in.
      //if (token) {
      //  dispatch(addItemDB(product.id));
      //}
    }
  }

  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className='single-product'>
      <div className='header-filler'></div>
      <div className='single-product__img__container'>
        <img
          className='single-product__col-1'
          src={require(`../../assets/${product && product.image}`)}
        />
      </div>
      <div className='single-product__col-2'>
        <div className='single-product__col-2__header'>
          <div className='single-product__col-2__header__left'>
            <h1 id='p-title'>{product?.title}</h1>
            <h1>${product?.price}</h1>
            <p className='single-product__col-2__header__pstatus'>
              {product?.status}
            </p>
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
          <select onChange={handleQty}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button
            className=''
            onClick={() => product && addProductHandler(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
