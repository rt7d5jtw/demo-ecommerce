import * as React from 'react';
import './category-delete.css';
import { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  buildCategory,
  fetchCategories,
  removeCategory,
  updateCategory,
} from '../../../redux/category/category.actions';
import { selectCategories } from '../../../redux/category/category.selectors';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getCategories } from '../../../services/category.service';

type FormValues = {
  categories: string;
};

export const CategoryDelete = (): JSX.Element => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(removeCategory(data.categories));
  };

  return (
    <div className='delete-categories'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Delete a category</label>
        <select {...register('categories')} name='categories' id='categories'>
          {categories.map(({ id, cname }) => (
            <option value={id} key={id}>
              {cname}
            </option>
          ))}
        </select>
        <input type='submit' value='Delete' />
      </form>
    </div>
  );
};
