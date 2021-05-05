import * as React from 'react';
import './products-delete.css';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectProductItems } from '../../../redux/product/product.selectors';
import { fetch, remove } from '../../../redux/product/product.actions';

function ProductsDelete() {
  const products = useSelector(selectProductItems);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    dispatch(remove(data['id']));
    location.reload();
  };
  return (
    <div className='product-deletion'>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Delete a product</label>
          <select ref={register} name='id' id='products'>
            {products.map(({ id, title }: any) => (
              <option value={id} key={id}>
                {title}
              </option>
            ))}
          </select>
          <button type='submit'>Delete</button>
        </form>
      </div>
    </div>
  );
}

export default ProductsDelete;
