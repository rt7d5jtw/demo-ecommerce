import * as React from 'react';
import './products-create.css';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { selectCategories } from '../../../features/category/categorySlice';
import { fetch } from '../../../features/category/thunks';
import { add as addProduct } from '../../../features/product/thunks';
import { useDispatch, useSelector } from 'react-redux';

type FormValues = {
  title: string;
  image: string;
  price: number;
  description: string;
  author: string;
  category: string;
  quantity: 1;
  id: number;
};

function ProductsCreate(): JSX.Element {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    dispatch(addProduct(data));
  };
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  return (
    <div className='creator-products'>
      <div className='product-creator'>
        <h1>Create a product</h1>
        <form id='create-product' onSubmit={handleSubmit(onSubmit)}>
          <label>Product title</label>
          <input
            type='text'
            placeholder='Product title'
            {...register('title', { required: 'You must specify a title' })}
            required
          />
          <label>Product image</label>
          <p className='admin-product-text'>
            Use image url or upload an image to use as product image
          </p>
          <input type='text' placeholder='Product image' {...register('image')} />
          <p id='product-or-text'>or</p>
          <input
            type='file'
            {...register('image', { required: 'You must specify an image' })}
            id='image'
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
          <select {...register('category')} form='create-product' name='category' id='categories'>
            {categories.map(({ id, cname }) => (
              <option {...register} value={id} key={id}>
                {cname}
              </option>
            ))}
          </select>
          <label>Product description</label>
          <textarea
            {...register('description')}
            name='description'
            placeholder='Product description'
            form='create-product'
          ></textarea>
          <input type='submit' value='Create' />
        </form>
      </div>
    </div>
  );
}

export default ProductsCreate;
