import * as React from 'react';
import './homefront.css';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { ICategory, selectCategories } from '../../features/category/categorySlice';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { IProduct } from '../../features/product/productSlice';
import { selectItems } from '../../features/product/selectors';
import ProductCard from '../../features/product/product-card/product-card.component';
import { useRef, useEffect, useState } from 'react';
import mainImg from './../../assets/Untitled.png';
import Alert from '../../features/alert/alert/alert.component';
import { userLogged } from '../../features/alert/alertSlice';
import { assignRole } from '../../features/user/thunks';

interface IHomefront {
  categories: ICategory[];
  products: IProduct[];
}

const Homefront = ({ categories, products }: IHomefront): JSX.Element => {
  const productsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const dispatch = useDispatch();

  //dispatch(userLogged())
  //dispatch(assignRole())

  /*
  const callback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setVisible(entry.isIntersecting);
    } else if (!entry.isIntersecting && entry.boundingClientRect.y > 153) {
      setVisible(entry.isIntersecting);
    }
  };

  const options = {
    root: null,
    rootMargin: '0px 0px -765px 0px',
    threshold: 0.05,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (productsRef.current) observer.observe(productsRef.current);

    return () => {
      if (productsRef.current) observer.unobserve(productsRef.current);
    };
  }, [productsRef, options]);
   */

  return (
    <div className='homefront'>
      <Alert />
      <h1 id='storefront__letters'>Rich Chocolate</h1>
      <div id='storefront__block' />
      <div
        ref={categoriesRef}
        className={isVisible ? 'homefront__categories--fade' : 'homefront__categories'}
      >
        {categories
          .filter(
            (cat) =>
              cat.cname === 'bestsellers' ||
              cat.cname === 'Milk Chocolate' ||
              cat.cname === 'Dark Chocolate'
          )
          .map(({ cname, id }) => (
            <Link to={'/products/' + cname} href={cname} key={id}>
              {cname}
            </Link>
          ))}
        <Link to='/'>Shop All</Link>
      </div>

      <div style={preview ? { transform: 'translateY(30%)' } : {}} className='homefront__hero'>
        <p>Interested in our products?</p>
        <p onClick={() => setPreview(!preview)}>Preview few now</p>
      </div>
      <div id='storefront__image' style={{ backgroundImage: `url(${mainImg})` }} />

      <div
        ref={productsRef}
        id='hf-pw'
        className='homefront__product-windows'
        style={preview ? { visibility: 'visible', transform: 'translateX(0%)' } : {}}
      >
        {products
          .filter((_e, idx) => idx < 3)
          .map(({ id, title, image, price, description, categories }: IProduct) => (
            <div key={id} className='homefront__product-windows__product'>
              <ProductCard
                key={id}
                id={id}
                title={title}
                image={image}
                price={price}
                description={description}
                categories={categories}
                quantity={1}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

interface IMapStateToProps {
  categories: ICategory[];
  products: IProduct[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  categories: selectCategories,
  products: selectItems,
});

export default connect(mapStateToProps)(Homefront);
