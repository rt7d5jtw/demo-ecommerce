import * as React from 'react';
import './products-delete.css';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { connect, useDispatch, useSelector } from 'react-redux';

function ProductsDelete() {
  //const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  useEffect(() => {
    //dispatch(fetchCategories())
  }, [dispatch])
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    //dispatch(removeCategory(data.categories));
    location.reload()
  };
  return (
    <div className='product-deletion'>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Delete a product</label>
            <select ref={register} name="categories" id="categories">
              {/*products.map(({ id, title}) => (
                <option value={id} key={id}>{title}</option>
              ))*/}
            </select>
            <button type="submit">Delete</button>
        </form>
      </div>
    </div>
  );
}

export default ProductsDelete;
