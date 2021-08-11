import * as React from 'react';
import './category-page.css';
import { IProduct } from '../../features/product/productSlice';
import ProductCard from '../../features/product/product-card/product-card.component';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { selectItems } from '../../features/product/selectors';
import { selectCategories, ICategory } from '../../features/category/categorySlice';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { SingleProductPage } from '../single-product/single-product.component';
import { fetch as fetchCategories } from '../../features/category/thunks';
import { fetch as fetchProducts } from '../../features/product/thunks';

interface ICategoryPage {
  categories: ICategory[];
  products: IProduct[];
}

function CategoryPage({ categories, products }: ICategoryPage): JSX.Element {
  const { category } = useParams<{ category?: string }>();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState<number>(20);

  /* get the page category name */
  const currentCategory =
    category === 'shopall'
      ? { cname: 'shopall', id: '' }
      : categories.find(({ cname }: ICategory) => cname === category);

  React.useEffect(() => {
    categories.length === 0
      ? dispatch(fetchCategories())
      : products.length === 0
      ? dispatch(fetchProducts())
      : null;
  }, [dispatch]);

  if (products.length === 0 || categories.length === 0) {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    return <p>Loading...</p>;
  }

  const productsRef = React.useRef<HTMLDivElement>(null);

  const callback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setPage(page + 20);
    }
  };

  const options = {
    root: null,
    rootMargin: '0px -50px 0px -50px',
    threshold: 1,
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (productsRef.current) observer.observe(productsRef.current);

    return () => {
      if (productsRef.current) observer.unobserve(productsRef.current);
    };
  }, []);
  return (
    <div className='category-page'>
      <Switch>
        <Route path={`${match.path}/:productId`} component={SingleProductPage} />
      </Switch>
      <h1 className='category-page__title'>
        <p>
          {currentCategory && currentCategory.cname === 'shopall'
            ? 'All Products'
            : currentCategory && currentCategory.cname
            ? currentCategory.cname
            : 'Category could not be found :('}
        </p>
      </h1>
      <div className='category-page__products'>
        {currentCategory && currentCategory.id
          ? products
              .filter(({ categories }) => {
                for (const key in categories) {
                  if (categories[key].cname.includes(currentCategory.cname)) {
                    return categories[key];
                  }
                }
              })
              .map(({ title, price, id, image, categories, description }: IProduct) => (
                <ProductCard
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  price={price}
                  image={image}
                  quantity={1}
                  categories={categories}
                />
              ))
          : currentCategory && currentCategory.cname === 'shopall'
          ? products
              .filter((_value, idx) => idx < page)
              .map(({ title, price, id, image, categories, description }: IProduct) => (
                <ProductCard
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  price={price}
                  image={image}
                  quantity={1}
                  categories={categories}
                />
              ))
          : 'Category ID could not be found!'}
        <div id='render-mark' ref={productsRef} />
      </div>
    </div>
  );
}

interface IMapStateToProps {
  products: IProduct[];
  categories: ICategory[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  products: selectItems,
  categories: selectCategories,
});

export default connect(mapStateToProps)(CategoryPage);
