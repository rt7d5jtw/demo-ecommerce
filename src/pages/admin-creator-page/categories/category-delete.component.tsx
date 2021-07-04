import * as React from 'react';
import './category-delete.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch, remove } from '../../../features/category/thunks';
import { selectCategories } from '../../../features/category/categorySlice';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  categories: string;
};

export const CategoryDelete = (): JSX.Element => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    confirm('Are you sure you want to delete this category?') && dispatch(remove(data.categories));
  };

  return (
    <div className='admin-delete'>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Delete a category</h1>
          <select {...register('categories')} name='categories' id='categories'>
            {categories.map(({ id, cname }) => (
              <option value={id} key={id}>
                {cname}
              </option>
            ))}
          </select>
          <button type='submit'>Delete Category</button>
        </form>
      </div>
    </div>
  );
};
