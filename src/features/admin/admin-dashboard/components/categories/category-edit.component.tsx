import * as React from 'react';
import './category-edit.css';
import { useEffect } from 'react';
import { fetch, update } from '../../../../../features/category/thunks';
import { selectCategories } from '../../../../../features/category/categorySlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

type FormValues = {
  id: string;
  cname: string;
};

export const CategoryEdit = (): JSX.Element => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    confirm('Are you sure you wanna edit this category?') && dispatch(update(data));
  };

  return (
    <div className='admin-update'>
      <div className='category-update'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Edit a category</h1>
          <label>Select a category to edit</label>
          <select
            {...register('id')}
            name='id'
            title='Select category which you want to update'
            id='categories2'
          >
            {categories.map(({ id, cname }) => (
              <option value={id} key={id}>
                {cname}
              </option>
            ))}
          </select>
          <input
            type='text'
            {...register('cname')}
            name='cname'
            placeholder='New category name'
            title='Input a new name for the category'
          />
          <input type='submit' value='Edit' />
        </form>
      </div>
    </div>
  );
};
