import * as React from 'react';
import './products-edit.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { selectCategories } from '../../../redux/category/category.selectors';
import { fetchCategories } from '../../../redux/category/category.actions';
import { fetch, editProduct, fetchProducts } from '../../../redux/product/product.actions';
import { selectProductItems } from '../../../redux/product/product.selectors';
import { Product } from '../../../redux/types';
import { getProducts, PRODUCT_URL } from '../../../services/product.service';
import axios from 'axios';


type ProductInputs = {
  title: string;
  image: string;
  price: number;
  description: string;
  author: string;
  id: string;
}

function ProductsEdit() {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm<ProductInputs>();
  const onSubmit: SubmitHandler<ProductInputs> = data => {
    dispatch(editProduct(data));
    console.log(data);
  }
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch])
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProductItems);
  return (
  <div className='edit-products'>
    <div className='product-editor'>
      <form id='create-product'>
        <h1>Edit a product</h1>
        <label>Product title</label>
        <input
          type='text'
          name='title'
          placeholder='Product title'
          ref={register({ required: 'You must specify a title' })}
          required
        />
        <label>Product image</label>
        <input
          type='text'
          name='image'
          placeholder='Product image'
          ref={register({ required: 'You must specify a image' })}
          required
        />
        <label>Product price</label>
        <input
          type='number'
          name='price'
          placeholder='Product price'
          ref={register({ required: 'You must specify a price' })}
          required
        />
        <label>Product author</label>
        <input
          type='text'
          name='author'
          placeholder='Product author'
          ref={register({ required: 'You must specify a author' })}
          required
        />
        <label>Product category</label>
        <select ref={register} form='create-product' name='id' id='products'>
          {products.map(({ title , id }: Product) => (
            <option key={id} ref={register} value={id}>{title}</option>
          ))}
        </select>
        <label>Product description</label>
        <textarea ref={register} name='description' form='create-product'></textarea>
          <button type='submit' onClick={handleSubmit(onSubmit)}>Edit</button>
      </form>
    </div>
  </div>
  );
}

export default ProductsEdit;
