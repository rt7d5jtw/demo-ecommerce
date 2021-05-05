import * as React from 'react';
import './category-create.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { buildCategory } from '../../../redux/category/category.actions';

type CategoryInputs = {
  cname: string;
};

function CategoryCreate() {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm<CategoryInputs>();
  const onSubmit: SubmitHandler<CategoryInputs> = (data) => {
    dispatch(buildCategory(data['cname']));
    console.log(data['cname']);
  };
  return (
    <div className='creator-categories'>
      <div className='category-creator'>
        <form id='create-product'>
          <h1>Create a category</h1>
          <label>Category name</label>
          <input
            type='text'
            name='cname'
            placeholder='Category name'
            ref={register({ required: 'You must specify a name for the category' })}
            required
          />
          <button type='submit' onClick={handleSubmit(onSubmit)}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default CategoryCreate;
