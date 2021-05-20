import * as React from 'react';
import './category-delete.css';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetch, remove } from '../../../features/category/categorySlice';
import { selectCategories } from '../../../features/category/categorySlice';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  categories: string;
};

export const CategoryDelete = (): JSX.Element => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(remove(data.categories));
  };

  return (
    <div className='delete-categories'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Delete a category</label>
        <select {...register('categories')} name='categories' id='categories'>
          {categories.map(({ id, cname }) => (
            <option value={id} key={id}>
              {cname}
            </option>
          ))}
        </select>
        <input type='submit' value='Delete' />
      </form>
    </div>
  );
};
