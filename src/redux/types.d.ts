export interface User {
  email: string;
  password: string;
}

export interface UserState {
  currentUser: null | User;
  loggedIn: boolean;
  requesting: boolean;
  succesful: boolean;
  messages: Array<string>;
  errors: Array<string>;
};

export interface Product {
  id: string;
  categoryId?: string;
  title: string;
  quantity: number;
  image: string;
  price: number;
  author?: string;
  desc?: string;
}

export interface ProductState {
  items: Array;
  search: string;
  searchItems: Product[],
  loading: boolean;
  error: null | Error;
}

export interface CartState {
  isOpen: boolean;
  cartItems: Product[];
  quantity: number;
}

export interface CartItem {
  title: string;
  quantity: number;
  price: number;
  image: string;
  id: string;
}

export type Alert = {
  message: string;
}

export interface AlertState {
  message: string;
  atype: enum;
  timeout: number;
}

export interface ActionType {
  type: string;
  payload?: any;
}

