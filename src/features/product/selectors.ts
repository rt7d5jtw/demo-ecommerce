import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { IProduct, IProductRaw, IProductState } from './productSlice';

export const selectRoot = (state: RootState): IProductState => state.product;

export const selectItems = createSelector([selectRoot], (product: IProductState) => product.items);

export const selectSearch = createSelector(
  [selectRoot],
  (product: IProductState) => product.search
);

export const selectSearchItems = createSelector(
  [selectRoot],
  (product: IProductState) => product.searchItems
);

export const normalizeProducts = (products: IProductRaw[]): IProduct[] => {
  for (const i in products) {
    products[i].categories = products[i].categories.map(({ cname }) => cname);
  }
  return products;
};

export const normalizeProduct = (product: IProductRaw): IProduct => {
  product.categories = product.categories.map(({ cname }) => cname);
  return product;
};
