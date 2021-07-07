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
import { useEffect } from 'react';

interface ICategoryPage {
  categories: ICategory[];
  products: IProduct[];
}

function CategoryPage({ categories, products }: ICategoryPage): JSX.Element {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const match = useRouteMatch();
  const dispatch = useDispatch();

  /* get the page category name */
  const currentCategory = categories.find(({ cname }: ICategory) => cname === categoryId);

  useEffect(() => {
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

  return (
    <div className='category-page'>
      <Switch>
        <Route path={`${match.path}/:productId`} component={SingleProductPage} />
      </Switch>
      <h1 className='category-page__title'>
        <p>
          {currentCategory && currentCategory.cname
            ? currentCategory.cname
            : 'Category could not be found :('}
        </p>
      </h1>
      <div className='category-page__products'>
        {currentCategory && currentCategory.id
          ? products
              .filter((product: IProduct) => product.categoryId === currentCategory.id)
              .map(({ title, price, id, image, categoryId, description, author }: IProduct) => (
                <ProductCard
                  key={id}
                  id={id}
                  title={title}
                  author={author}
                  description={description}
                  price={price}
                  image={image}
                  quantity={1}
                  categoryId={categoryId}
                />
              ))
          : 'Category ID could not be found!'}
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
