import * as React from 'react';
import './category-page.css';
import { Footer } from '../../components/footer/footer.component';
import { Navbar } from '../../components/navbar/navbar.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import { Category, Product } from '../../redux/types';
import ProductCard from '../../components/product-card/product-card.component';
import { connect, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../redux/root-reducer';
import { selectProductItems } from '../../redux/product/productSlice';
import { selectCategories } from '../../redux/category/category.selectors';
import { Route, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import Main from '../main/main.component';
import { SingleProductPage } from '../single-product/single-product.component';
import { useEffect } from 'react';

interface ICategoryPage {
  categories: any;
  products: Product[];
}

function CategoryPage({ categories, products }: ICategoryPage): JSX.Element {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const { path, url } = useRouteMatch();
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
  products: selectProductItems,
  categories: selectCategories,
});

export default connect(mapStateToProps)(CategoryPage);
