export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface User {
  email: string;
  password: string;
}

export interface IUser {
  email: string;
  password: string;
  id: string;
  role: UserRole;
  salt: string;
  createdAt: string;
}

export interface UserState {
  currentUser: null | User;
  loggedIn: boolean;
  loading: boolean;
  role: UserRole;
  hash: string | null;
  users: IUser[];
  requesting: boolean;
  succesful: boolean;
  messages: Array<string>;
  errors: Array<string>;
  email: string;
}

export interface Product {
  id?: string;
  category?: string;
  title: string;
  quantity?: number;
  image: string;
  price: number;
  author?: string;
  description?: string;
  categoryId?: string;
}

export interface ProductwithID {
  id: string;
  title: string;
  image: string;
  price: number;
  author: string;
  description: string;
}

export interface Product_for_CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  author: string;
  description: string;
  quantity: number;
}

export interface ProductState {
  items: Array;
  search: string;
  searchItems: Product[];
  loading: boolean;
  error: null | Error;
}

export interface Order {
  address: string;
  date: string;
  id: string;
  status: string;
  total_price: number;
  userId: string;
}

export interface OrderState {
  orders: Order[];
}

export interface CartState {
  isOpen: boolean;
  items: any;
  quantity: number;
  price: number;
}

export interface CartItem {
  title: string;
  quantity: number;
  price: number;
  image: string;
  id?: string;
}

export type Alert = {
  message: string;
};

export interface AlertState {
  message: string;
  atype: enum;
  timeout: number;
}

export interface ActionType {
  type: string;
  payload?: any;
}

/*
export type Category = {
  title: string;
  image: string;
  id: number,
  url: string;
}
*/

export interface Category {
  cname: string;
  id: string;
}

export interface CategoryState {
  categories: Category[];
}

export type _Promotions = {
  id?: number;
  image: string;
  title: string;
  url: string;
};

export interface PromotionsState {
  promotions: _Promotions[];
  test: any[];
  loading: boolean;
}

type LoaderObj = {
  actions: string[];
  refreshing: string[];
};

export interface UIState {
  loader: LoaderObj;
}
