import * as React from 'react';
import { connect } from 'react-redux';
import ProductCard from '../../features/product/product-card/product-card.component';
import { createStructuredSelector } from 'reselect';
import { RootState } from '../../app/store';
import { IProduct } from '../../features/product/productSlice';
import { selectSearch, selectSearchItems } from '../../features/product/selectors';

interface ISearchPage {
  searchItems: IProduct[];
  search: string;
}

const SearchPage = ({ searchItems, search }: ISearchPage) => {
  return (
    <>
      <h1 className='category-page__title'>Searched for {search}</h1>
      <div className='products'>
        {searchItems.map(({ id, ...props }) => (
          <ProductCard key={id} id={id} {...props} />
        ))}
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector<RootState, ISearchPage>({
  search: selectSearch,
  searchItems: selectSearchItems,
});

export default connect(mapStateToProps)(SearchPage);
