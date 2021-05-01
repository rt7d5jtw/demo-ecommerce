import * as React from 'react';
import './products-create.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { selectCategories } from '../../../redux/category/category.selectors';
import { fetchCategories } from '../../../redux/category/category.actions';
import { buildProduct } from '../../../redux/product/product.actions';

type ProductInputs = {
  title: string;
  image: string;
  price: number;
  description: string;
  author: string;
  category: string;
  quantity: 1;
}

function ProductsCreate() {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm<ProductInputs>();
  const onSubmit: SubmitHandler<ProductInputs> = data => {
    dispatch(buildProduct(data));
  }
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
  <div className='creator-products'>
    <div className='product-creator'>
      <form id='create-product'>
        <h1>Create a product</h1>
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
        <select ref={register} form='create-product' name='category' id='categories'>
          {categories.map(({ id, cname }) => (
            <option ref={register} value={id} key={id}>{cname}</option>
          ))}
        </select>
        <label>Product description</label>
        <textarea ref={register} name='description' form='create-product'></textarea>
          <button type="button" onClick={handleSubmit(onSubmit)}>Create</button>
      </form>
    </div>
  </div>
  );
}

export default ProductsCreate;
