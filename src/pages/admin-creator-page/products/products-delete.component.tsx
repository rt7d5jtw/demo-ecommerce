import * as React from 'react';
import './products-delete.css';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectItems } from '../../../features/product/selectors';
import { fetch, remove } from '../../../features/product/thunks';
import { Product } from '../../../features/product/productSlice';

type FormValues = {
  id: string;
};

function ProductsDelete(): JSX.Element {
  const products = useSelector(selectItems);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(remove(data['id']));
  };
  return (
    <div className='product-deletion'>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Delete a product</label>
          <select {...register('id')} id='products'>
            {products.map(({ id, title }: Product) => (
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
