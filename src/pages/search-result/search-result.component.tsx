import * as React from 'react';
import { Footer } from '../../features/homepage-components/footer/footer.component';
import { Navbar } from '../../features/homepage-components/navbar/navbar.component';
import Sidebar from '../../features/homepage-components/sidebar/sidebar.component';
import { connect } from 'react-redux';
import ProductCard from '../../features/product/product-card/product-card.component';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { Product } from '../../app/types';
import { selectSearch, selectSearchItems } from '../../features/product/productSlice';
import Main from '../../features/homepage-components/main/main.component';

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
