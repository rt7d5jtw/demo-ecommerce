import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { CartState, ICartItem } from './cartSlice';

const selectRoot = (state: RootState) => state.cart;

export const selectCartItems = createSelector([selectRoot], (cart: CartState) => cart.items);

export const selectOpen = createSelector([selectRoot], (cart: CartState) => cart.isOpen);

export const selectQuantity = createSelector([selectRoot], (cart: CartState) => cart.quantity);

export const selectCartTotal = createSelector([selectCartItems], (items: ICartItem[]) =>
  items.reduce((accumulator, cartItem) => accumulator + cartItem.price * cartItem.quantity, 0)
);

/* contains the logic to differentiate between items
 * with the same id, so only quantity gets added
 * instead of another item being added as a CartItem */
export const addItemToCart = (stateItems: ICartItem[], itemToAdd: ICartItem): ICartItem[] => {
  if (itemToAdd.productId === undefined || itemToAdd.productId === null) {
    throw new Error('Cart Item is missing Product ID');
  }
  const existingItem = stateItems.find((item: ICartItem) => item.productId == itemToAdd.productId);
  if (existingItem) {
    return stateItems.map((item: ICartItem) =>
      item.productId == itemToAdd.productId ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  return [...stateItems, { ...itemToAdd, quantity: 1 }];
};

export const removeItemFromCart = (
  stateItems: ICartItem[],
  itemToRemove: ICartItem
): ICartItem[] => {
  const existingItem = stateItems.find(
    (item: ICartItem) => item.productId == itemToRemove.productId
  );

  /* if items quantity is 1, remove the whole item */
  if (existingItem && existingItem.quantity === 1) {
    return stateItems.filter((item) => item.productId !== itemToRemove.productId);
  }

  /* otherwise, only decrement the quantity */
  return stateItems.map((item) =>
    item.productId == itemToRemove.productId ? { ...item, quantity: item.quantity - 1 } : item
  );
};
