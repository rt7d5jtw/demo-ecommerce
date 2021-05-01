import * as React from 'react';
import './category-edit.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, updateCategory } from '../../../redux/category/category.actions';
import { selectCategories } from '../../../redux/category/category.selectors';
import { useForm } from 'react-hook-form';


export const CategoryEdit = () => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    const { id, cname } = data;
    dispatch(updateCategory(id, cname));
  };

  return (
  <div className='edit-categories'>
    <div className='category-editor'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Edit a category</h1>
      <label>Select a category to edit</label>
        <select ref={register} name='id' title='Select category which you want to update'>
          {categories.map(({ id, cname }) => (
            <option value={id} key={id}>{cname}</option>
          ))}
        </select>
        <input type='text' ref={register} name='cname' placeholder="New category name" title='Input a new name for the category' />
        <button type='submit'>Edit</button>
    </form>
    </div>
  </div>
  );
}
