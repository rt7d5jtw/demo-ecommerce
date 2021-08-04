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
import { useRef, useState } from 'react';
import mainImg from './../../assets/Untitled.png';
import Alert from '../../features/alert/alert/alert.component';

interface IHomefront {
  categories: ICategory[];
  products: IProduct[];
}

const Homefront = ({ categories, products }: IHomefront): JSX.Element => {
  const [preview, setPreview] = useState<boolean>(false);
  return (
    <div className='homefront'>
      <Alert />
      <h1 id='storefront__letters'>Rich Chocolate</h1>
      <div id='storefront__block' />
      <div className='homefront__categories'>
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
        <Link to='/products/shopall'>Shop All</Link>
      </div>

      <div style={preview ? { transform: 'translateY(30%)' } : {}} className='homefront__hero'>
        <p>Interested in our products?</p>
        <p onClick={() => setPreview(!preview)}>Preview few now</p>
      </div>
      <div id='storefront__image' style={{ backgroundImage: `url(${mainImg})` }} />

      <div
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
