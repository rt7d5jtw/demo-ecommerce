import * as React from 'react';
import './category-edit.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch, update } from '../../../redux/category/categorySlice';
import { selectCategories } from '../../../redux/category/categorySlice';
import { useForm, SubmitHandler } from 'react-hook-form';

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
    const { id, cname } = data;
    dispatch(update(data));
  };

  return (
    <div className='edit-categories'>
      <div className='category-editor'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Edit a category</h1>
          <label>Select a category to edit</label>
          <select {...register('id')} name='id' title='Select category which you want to update'>
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
