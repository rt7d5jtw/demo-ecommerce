import axios from 'axios';
import { Product, ProductwithID } from '../redux/types';

export const PRODUCT_URL = 'http://localhost:3000/product'

export const arrayToObject = (array: any) =>
  array.reduce((obj: any, item: any) => {
    obj[item.id] = item
    return obj
  }, {})

export const getProducts = (): any => {
  return axios.get(PRODUCT_URL).then(res => {
    return arrayToObject(res.data);
  })
}

export async function fetchingProds() {
  let res = await axios.get(PRODUCT_URL);
  let data = res.data;
  console.log(data);
}

/* fetches books in the outlet category, it is directly refrencing the categoryId from Product's table */
export const fetchOutlet = (): any => {
  axios.get(PRODUCT_URL.concat('?cat=dcaa9f09-0dbe-4e81-af92-e15ee487beaa'))
    .then((res) => {
      return res.data;
    })
    .catch(err => console.log(err))
}

export const createProduct = ({ ...productProps }: Product): Promise<any> => {
  return axios.post(PRODUCT_URL, { ...productProps });
}

export const updateProduct = ({ id, ...updateProps }: ProductwithID): Promise<any> => {
  return axios.patch(PRODUCT_URL.concat('/' + id), { ...updateProps });
}
