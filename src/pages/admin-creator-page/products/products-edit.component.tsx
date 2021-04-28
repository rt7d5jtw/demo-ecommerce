import * as React from 'react';
import './products-edit.css';
import { useForm, SubmitHandler } from 'react-hook-form';

type ProductInputs = {
  title: string;
  image: string;
  price: number;
  description: string;
  author: string;
  category: string;
}

function ProductsEdit() {
  const { register, handleSubmit, errors } = useForm<ProductInputs>();
  const onSubmit: SubmitHandler<ProductInputs> = data => {
    console.log(data);
  }
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
        <select ref={register} form='create-product' name='categories' id='categories'>
          <option key={1} ref={register} value='classics'>Classics</option>
          <option key={2} ref={register} value='outlet'>Outlet</option>
        </select>
        <label>Product description</label>
        <textarea ref={register} name='description' form='create-product'></textarea>
          <button type="button" onClick={handleSubmit(onSubmit)}>Edit</button>
      </form>
    </div>
  </div>
  );
}

export default ProductsEdit;
