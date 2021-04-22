import * as React from 'react';
import './category-edit.css';
import { useState, useEffect } from 'react';
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
    //dispatch(updateCategory(id, data));
  };

  return (
        <div className='form-wrapper'>
          <form className='admin-form' onSubmit={handleSubmit(onSubmit)}>
            <label>Edit Category</label>
            <input type="text" placeholder="Category name" />
              <select ref={register} name="categories" id="categories">
                {categories.map(({ id, cname }) => (
                  <option value={id} key={id}>{cname}</option>
                ))}
              </select>
              <button type="submit">Delete</button>
          </form>
        </div>
  );
}
