import * as React from 'react';
import './products-delete.css';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectItems } from '../../../../../features/product/selectors';
import { fetch, remove } from '../../../../../features/product/thunks';
import { IProduct } from '../../../../../features/product/productSlice';

type FormValues = {
  id: number;
};

function ProductsDelete(): JSX.Element {
  const products = useSelector(selectItems);
  const dispatch = useDispatch();
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetch());
    }
  }, [dispatch]);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    confirm('Are you sure you want to delete this product?') && dispatch(remove(data['id']));
  };

  return (
    <div className='admin-delete'>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Delete a product</h1>
          <select {...register('id')} id='products'>
            {products.map(({ id, title }: IProduct) => (
              <option value={id} key={id}>
                {title}
              </option>
            ))}
          </select>
          <button type='submit'>Delete Product</button>
        </form>
      </div>
    </div>
  );
}

export default ProductsDelete;
