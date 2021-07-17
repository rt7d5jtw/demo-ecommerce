import * as React from 'react';
import './homefront.css';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { ICategory, selectCategories } from '../../features/category/categorySlice';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IProduct } from '../../features/product/productSlice';
import { selectItems } from '../../features/product/selectors';
import ProductCard from '../../features/product/product-card/product-card.component';
import { useRef, useEffect } from 'react';

interface IHomefront {
  categories: ICategory[];
  products: IProduct[];
}

const Homefront = ({ categories, products }: IHomefront): JSX.Element => {
  const elementRef = useRef<HTMLDivElement>(null);

  const something = (target: any) => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.05,
    };
    const io = new IntersectionObserver(fadein, options);
  };
  const fadein = () => {
    console.log('yeet');
  };

  useEffect(() => {
    console.log(elementRef);
  }, []);

  return (
    <div className='homefront'>
      <div ref={elementRef} className='homefront__categories'>
        {categories.map(({ cname, id }) => (
          <Link to={'/books/' + cname} href={cname} key={id}>
            {cname}
          </Link>
        ))}
        <Link to='/'>Shop All</Link>
      </div>

      <div className='homefront__hero'>
        <p>Find books that interest you from wide collection</p>
      </div>

      <div className='homefront__product-windows'>
        {products
          .filter((_e, idx) => idx < 3)
          .map(({ id, title, image, price, author, description, categoryId }: IProduct) => (
            <div key={id} className='homefront__product-windows__product'>
              <ProductCard
                key={id}
                id={id}
                title={title}
                image={image}
                price={price}
                author={author}
                description={description}
                categoryId={categoryId}
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
