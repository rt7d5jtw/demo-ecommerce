import * as React from 'react';
import './category-create.css';
import { useForm, SubmitHandler } from 'react-hook-form';

type ProductInputs = {
  title: string;
  image: string;
  price: number;
  description: string;
  author: string;
  category: string;
}

function CategoryCreate() {
  const { register, handleSubmit, errors } = useForm<ProductInputs>();
  const onSubmit: SubmitHandler<ProductInputs> = data => {
    console.log(data);
  }
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
          <button type="button" onClick={handleSubmit(onSubmit)}>Create</button>
      </form>
    </div>

  </div>
  );
}

export default CategoryCreate;
