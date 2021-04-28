import * as React from 'react';
import './category-edit.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../redux/category/category.actions';
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
    //dispatch(updateCategory(id, data));
  };

  return (
  <div className='edit-categories'>
    <div className='category-editor'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Edit a category</h1>
      <label>Edit a category</label>
      <input type="text" placeholder="New category name" />
        <select ref={register} name="categories" id="categories">
          {categories.map(({ id, cname }) => (
            <option value={id} key={id}>{cname}</option>
          ))}
        </select>
        <button type="submit">Edit</button>
    </form>
    </div>
  </div>
  );
}
