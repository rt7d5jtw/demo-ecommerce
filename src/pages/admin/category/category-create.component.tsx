import * as React from 'react';
import './category-create.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { buildCategory } from '../../../redux/category/category.actions';
import { useForm } from 'react-hook-form';


export const CategoryCreate = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    dispatch(buildCategory(data));
  };

  return (
    <div className='profile-admin'>
      <div className='admin-category-wrapper'>
        <div className='form-wrapper'>
          <form className='admin-form' onSubmit={onSubmit}>
            <label>Category name</label>
            <input type="text" placeholder="Category name" />
            <button type="button">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}


