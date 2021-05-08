import * as React from 'react';
import './add-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

type FormValues = {
  title: string;
  image: string;
  link: string;
};

function PromotionsAdd(): JSX.Element {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    //dispatch(addPromotion(data))
  };
  return (
    <div className='add-promotions'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Add a promotion</h1>
        <input type='text' placeholder='Title' {...register('title')} required />
        <input type='text' placeholder='Link' {...register('link')} required />
        <input type='text' placeholder='Image' {...register('image')} required />
        <input type='submit' value='Add' />
      </form>
    </div>
  );
}

export default PromotionsAdd;
