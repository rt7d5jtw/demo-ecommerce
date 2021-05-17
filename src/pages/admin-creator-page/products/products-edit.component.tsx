import * as React from 'react';
import './products-edit.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { selectCategories } from '../../../redux/category/categorySlice';
import { fetch } from '../../../redux/category/categorySlice';
import { fetch as fetchProducts, update } from '../../../redux/product/productSlice';
import { selectItems } from '../../../redux/product/productSlice';
import { Product } from '../../../redux/types';
import { getProducts, PRODUCT_URL } from '../../../services/product.service';

type FormValues = {
  title: string;
  image: string;
  price: number;
  description: string;
  author: string;
  id: string;
};

function ProductsEdit() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(update(data));
  };
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectItems);
  return (
    <div className='edit-products'>
      <div className='product-editor'>
        <form id='create-product' onSubmit={handleSubmit(onSubmit)}>
          <h1>Edit a product</h1>
          <label>Product title</label>
          <input
            type='text'
            placeholder='Product title'
            {...register('title', { required: 'You must specify a title' })}
            required
          />
          <label>Product image</label>
          <input
            type='text'
            placeholder='Product image'
            {...register('image', { required: 'You must specify a image' })}
            required
          />
          <label>Product price</label>
          <input
            type='number'
            placeholder='Product price'
            {...register('price', { required: 'You must specify a price' })}
            required
          />
          <label>Product author</label>
          <input
            type='text'
            placeholder='Product author'
            {...register('author', { required: 'You must specify a author' })}
            required
          />
          <label>Product category</label>
          <select {...register('id')} form='create-product' name='id' id='products'>
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
          <input type='submit' value='Edit' />
        </form>
      </div>
    </div>
  );
}

export default ProductsEdit;
