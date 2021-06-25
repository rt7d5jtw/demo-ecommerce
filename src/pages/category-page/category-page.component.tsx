import * as React from 'react';
import './category-page.css';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { Product } from '../../features/product/productSlice';
import ProductCard from '../../features/product/product-card/product-card.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { selectItems } from '../../features/product/selectors';
import { selectCategories, Category } from '../../features/category/categorySlice';
import { Route, useParams, useRouteMatch } from 'react-router-dom';
import Main from '../../features/homepage-components/main/main.component';
import { SingleProductPage } from '../single-product/single-product.component';
import { useEffect } from 'react';

interface ICategoryPage {
  categories: Category[];
  products: Product[];
}

function CategoryPage({ categories, products }: ICategoryPage): JSX.Element {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const { url } = useRouteMatch();
  useEffect(() => console.log(products));
  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <Route path={`${url}/:bookId`} component={SingleProductPage} />
        <div className='category-page'>
          <h1 className='category__title'>
            <p>{categories.find(({ cname }: Category) => cname === categoryId).cname}</p>
          </h1>
          <div className='products'>
            {products
              .filter(
                (product: Product) =>
                  product.categoryId ===
                  categories.find(({ cname }: Category) => cname === categoryId).id
              )
              .map(({ title, price, id, image, quantity }: Product) => (
                <ProductCard
                  key={id}
                  id={id}
                  title={title}
                  price={price}
                  image={image}
                  quantity={quantity}
                />
              ))}
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
}

interface IMapStateToProps {
  products: Product[];
  categories: Category[];
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  products: selectItems,
  categories: selectCategories,
});

export default connect(mapStateToProps)(CategoryPage);
