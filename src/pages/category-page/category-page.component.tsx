import * as React from 'react';
import './category-page.css';
import { Footer } from '../../components/footer/footer.component';
import { Navbar } from '../../components/navbar/navbar.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import { Product } from '../../redux/types';
import ProductCard from '../../components/product-card/product-card.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../redux/root-reducer';
import { selectProductItems } from '../../redux/product/product.selectors';
import { selectCategories } from '../../redux/category/category.selectors';
import { useParams } from 'react-router-dom';

interface ICategoryPage {
  categories: any;
  products: Product[];
  categoryId: string;
}

function CategoryPage({ categories, products }: ICategoryPage) {
  let { categoryId } = useParams<{categoryId?: string}>();
  return (
    <>
      <Navbar />
      <Sidebar />
    <div className='category-page'>
      <h1 className='category__title'><p>{categories.find( ({ cname }: any) => cname === categoryId).cname}</p></h1>
      <div className='products'>
        {products
          .filter(product => product.categoryId === categories
            .find( ({ cname }: any) => cname === categoryId ).id)
          .map(({ title, price, id, image, quantity }) => (
            <ProductCard key={id} id={id} title={title} price={price} image={image} quantity={quantity} />
          ))}
      </div>
    </div>
      <Footer />
    </>
  )
}

interface IMapStateToProps {
  products: Product[];
  categories: any;
}

const mapStateToProps = createStructuredSelector<RootState, IMapStateToProps>({
  products: selectProductItems,
  categories: selectCategories
})

export default connect(mapStateToProps)(CategoryPage);
