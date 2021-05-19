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

type LoaderObj = {
  actions: string[];
  refreshing: string[];
};

export interface UIState {
  loader: LoaderObj;
}
