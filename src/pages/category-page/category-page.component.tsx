import * as React from 'react';
import './category-page.css';
import { Footer } from '../../components/footer/footer.component';
import { Navbar } from '../../components/navbar/navbar.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import { Category, Product } from '../../redux/types';
import ProductCard from '../../components/product-card/product-card.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../redux/root-reducer';
import { selectProductItems } from '../../redux/product/product.selectors';
import { selectCategories } from '../../redux/category/category.selectors';
import { useParams } from 'react-router-dom';
import Main from '../main/main.component';

interface ICategoryPage {
  categories: any;
  products: Product[];
  categoryId: string;
  find: () => Category;
}

function CategoryPage({ categories, products }: ICategoryPage) {
  const { categoryId } = useParams<{ categoryId?: string }>();
  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <div className='category-page'>
          <h1 className='category__title'>
            <p>{categories.find(({ cname }: Category) => cname === categoryId).cname}</p>
          </h1>
          <div className='products'>
            {products
              .filter(
                (product) =>
                  product.categoryId ===
                  categories.find(({ cname }: Category) => cname === categoryId).id
              )
              .map(({ title, price, id, image, quantity }) => (
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
