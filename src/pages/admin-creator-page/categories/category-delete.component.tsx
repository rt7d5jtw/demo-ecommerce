import * as React from 'react';
import './category-delete.css';
import { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { buildCategory, fetchCategories, removeCategory, updateCategory } from '../../../redux/category/category.actions';
import { selectCategories } from '../../../redux/category/category.selectors';
import { useForm } from 'react-hook-form';
import { getCategories } from '../../../services/category.service';

export const CategoryDelete = () => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    dispatch(removeCategory(data.categories));
    location.reload()
  };

  return (
  <div className='delete-categories'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Delete a category</label>
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

