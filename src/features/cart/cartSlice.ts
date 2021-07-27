import { createSlice, createAction } from '@reduxjs/toolkit';
import { fetchItems, addItemDB, removeItemDB, clearCartDB } from './thunks';
import { addItemToCart, removeItemFromCart } from './selectors';
import { IProductCard } from '../product/productSlice';

/* renames key id to productId and description and categoryId */
export function productToCartItem(product: IProductCard): ICartItem {
  /* deep copy the object & removes unwanted props */
  const cartItem = JSON.parse(JSON.stringify(product));
  delete cartItem.description;
  delete cartItem.categoryId;

  /* creates an array of objects of the key-value pairs */
  const renamed = Object.keys(cartItem).map((key) => {
    const newKey = { id: 'productId' }[key] || key;
    return { [newKey]: cartItem[key] };
  });
  /* constructs the item back into an object */
  return Object.assign({}, ...renamed);
}

export interface ICart {
  userId: string;
  id: string;
  createdAt: string;
}

export interface ICartItem {
  title: string;
  quantity: number;
  price: number;
  image: string;
  productId: number;
}

export type AddItemSuccess = Omit<ICartItem, 'title' | 'image'>;

export interface CartInfoDto extends ICartItem {
  cartId: string;
  productId: number;
}

export interface CartState {
  isOpen: boolean;
  items: ICartItem[];
  quantity: number;
  price: number;
  loading: boolean;
  errors: [] | unknown;
}

const initialState: CartState = {
  isOpen: false,
  items: [],
  quantity: 0,
  price: 0,
  loading: false,
  errors: [],
};

export const clearCart = createAction('cart/clearCart');
export const cartToggle = createAction<boolean>('cart/cartToggle');
export const addItem = createAction<ICartItem>('cart/addItem');
export const removeItem = createAction<ICartItem>('cart/removeItem');

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.quantity = 0;
    },
    cartToggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    addItem: (state, { payload }) => {
      state.items = addItemToCart(state.items, payload);
      state.quantity = state.quantity + 1;
      state.price;
    },
    removeItem: (state, { payload }) => {
      state.items = removeItemFromCart(state.items, payload);
      state.quantity = state.quantity - 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetchItems.fulfilled, (state, { payload }) => {
        state.items = payload;
        state.quantity = payload.reduce((acc: number, curr: ICartItem) => acc + curr.quantity, 0);
        state.loading = false;
      }),
      builder.addCase(fetchItems.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      }),
      builder.addCase(addItemDB.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(addItemDB.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(addItemDB.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      }),
      builder.addCase(removeItemDB.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(removeItemDB.fulfilled, (state) => {
        state.loading = false;
      }),
      builder.addCase(removeItemDB.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      }),
      builder.addCase(clearCartDB.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(clearCartDB.fulfilled, (state) => {
        state.items = [];
        state.quantity = 0;
        state.loading = false;
      }),
      builder.addCase(clearCartDB.rejected, (state, { payload }) => {
        state.errors = payload;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
