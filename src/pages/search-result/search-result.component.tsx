import * as React from 'react';
import { Footer } from '../../components/footer/footer.component';
import { Navbar } from '../../components/navbar/navbar.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import { connect } from 'react-redux';
import ProductCard from '../../components/product-card/product-card.component';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../redux/root-reducer';
import { Product } from '../../redux/types';
import { selectItems, selectSearch, selectSearchItems } from '../../redux/product/productSlice';
import Main from '../main/main.component';

interface ISearchPage {
  searchItems: Product[];
  search: string;
}

const SearchPage = ({ searchItems, search }: ISearchPage) => {
  return (
    <div className='homepage'>
      <Navbar />
      <Sidebar />
      <Main>
        <h1 className='category__title'>Searched for {search}</h1>
        <div className='products'>
          {searchItems.map(({ title, price, id, image, quantity }) => (
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
      </Main>
      <Footer />
    </div>
  );
};

const mapStateToProps = createStructuredSelector<RootState, ISearchPage>({
  search: selectSearch,
  searchItems: selectSearchItems,
});

export default connect(mapStateToProps)(SearchPage);
