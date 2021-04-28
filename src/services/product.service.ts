import axios from 'axios';

export const PRODUCT_URL = 'http://localhost:3000/product'

/* fetches books in the outlet category, it is directly refrencing the categoryId from Product's table */
export const fetchOutlet = (): any => {
  axios.get(PRODUCT_URL.concat('?cat=dcaa9f09-0dbe-4e81-af92-e15ee487beaa'))
    .then((res) => {
      return res.data;
    })
    .catch(err => console.log(err))
}
