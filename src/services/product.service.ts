import axios from 'axios';

export const PRODUCT_URL = 'http://localhost:3000/product'

/* fetches books in the outlet category, it is directly refrencing the categoryId from Product's table */
export const fetchOutlet = (): any => {
  axios.get(PRODUCT_URL.concat('?cat=da6339ae-d444-4418-a2e0-3d9a31140eb4'))
    .then((res) => {
      return res.data;
    })
    .catch(err => console.log(err))
}
