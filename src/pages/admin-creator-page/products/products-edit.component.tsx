import * as React from 'react';
import './products-edit.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { fetch as fetchProducts, update } from '../../../features/product/thunks';
import { selectItems } from '../../../features/product/selectors';
import { Product } from '../../../features/product/productSlice';

type FormValues = {
  title: string;
  image: string;
  price: number;
  description: string;
  author: string;
  id: number;
  quantity: 1;
  category: string;
};

function ProductsEdit(): JSX.Element {
  const products = useSelector(selectItems);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    confirm('Are you sure you want to edit this product?') && dispatch(update(data));
  };
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch]);
  return (
    <div className='admin-update'>
      <div className='product-update'>
        <form id='create-product' onSubmit={handleSubmit(onSubmit)}>
          <h1>Edit a product</h1>
          <label>Product title</label>
          <input type='text' placeholder='Product title' {...register('title')} />
          <label>Product image</label>
          <input type='text' placeholder='Product image' {...register('image')} />
          <label>Product price</label>
          <input type='number' placeholder='Product price' {...register('price')} />
          <label>Product author</label>
          <input type='text' placeholder='Product author' {...register('author')} />
          <label>Product category</label>
          <select {...register('id')} form='create-product' name='id' id='product-categories'>
            {products.map(({ title, id }: Product) => (
              <option key={id} {...register} value={id}>
                {title}
              </option>
            ))}
          </select>
          <label>Product description</label>
          <textarea
            {...register('description')}
            name='description'
            form='create-product'
          ></textarea>
          <input type='submit' value='Edit Product' />
        </form>
      </div>
    </div>
  );
}

export default ProductsEdit;
