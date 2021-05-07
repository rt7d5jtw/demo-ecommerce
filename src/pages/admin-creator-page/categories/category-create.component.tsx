import * as React from 'react';
import './category-create.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { buildCategory } from '../../../redux/category/category.actions';

type FormValues = {
  cname: string;
};

function CategoryCreate(): JSX.Element {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(buildCategory(data['cname']));
    console.log(data['cname']);
  };
  return (
    <div className='creator-categories'>
      <div className='category-creator'>
        <h1>Create a category</h1>
        <form id='create-product' onSubmit={handleSubmit(onSubmit)}>
          <input
            type='text'
            placeholder='Category name'
            {...register('cname', { required: 'You must specify a name for the category' })}
            id='cname'
            title='Type the name of the new category'
            required
          />
          <input type='submit' value='Create' />
        </form>
      </div>
    </div>
  );
}

export default CategoryCreate;
