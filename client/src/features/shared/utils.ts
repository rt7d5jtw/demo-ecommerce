/* utility functions */

import { IProduct } from '../product/productSlice';

export function updateState<T extends { id: number | string }>(
  newItem: T,
  state: T[]
): T[] {
  const id = state.findIndex(({ id }) => id === newItem.id);
  state[id] = newItem;
  return state;
}

export function removeFromState<T extends { id: number | string }>(
  removable: T,
  state: T[]
): T[] {
  return (state = state.filter(({ id }) => id !== removable.id));
}

export function guestProductHandler(
  products: IProduct[],
  product: { id: number }
): void {
  if (localStorage.getItem('products_added') === null) {
    localStorage.setItem(
      'products_added',
      JSON.stringify([{ id: products[products.length - 1].id + 1 }])
    );
    return;
  }
  /* parses contents of localStorage */
  const stuff = localStorage.getItem('products_added');
  if (stuff) {
    const parsed = JSON.parse(stuff);
    console.group('parsed :: ', parsed);
    /* adds the new product to the array */
    localStorage.setItem(
      'products_added',
      JSON.stringify([...parsed, product])
    );
    return;
  }
}

export function validateID_GUEST(id: number): boolean {
  const stuff = localStorage.getItem('products_added');
  if (stuff) {
    const morestuff = JSON.parse(stuff);
    const ids = morestuff.map((el: { id: number }) => el.id);
    return ids.includes(id) ? true : false;
  }
  throw Error('No products');
}
