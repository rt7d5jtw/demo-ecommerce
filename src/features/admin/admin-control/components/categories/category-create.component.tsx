import * as React from 'react';
import './category-create.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { create } from '../../../../../features/category/thunks';

type FormValues = {
  cname: string;
};

function CategoryCreate(): JSX.Element {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    confirm('Are you sure you want to create this category?') && dispatch(create(data['cname']));
  };
  return (
    <div className='admin-create'>
      <div className='category-create'>
        <form id='create-product' onSubmit={handleSubmit(onSubmit)}>
          <h1>Create a category</h1>
          <input
            type='text'
            placeholder='Category name'
            {...register('cname', { required: 'You must specify a name for the category' })}
            id='cname'
            title='Type the name of the new category'
            required
          />
          <input type='submit' value='Create category' />
        </form>
      </div>
    </div>
  );
}

export default CategoryCreate;
