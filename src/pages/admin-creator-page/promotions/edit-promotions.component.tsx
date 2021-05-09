import * as React from 'react';
import './edit-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

type FormValues = {
  title: string;
  image: string;
  link: string;
};

function PromotionsEdit(): JSX.Element {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    //dispatch(editPromotion(data))
  };
  return (
    <div className='edit-promotions'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Edit a promotion</h1>
        <input type='text' placeholder='Title' {...register('title')} required />
        <input type='text' placeholder='Link' {...register('link')} required />
        <input
          type='text'
          placeholder='Images preferrably 1470 x 556'
          {...register('image')}
          required
        />
        <input type='submit' value='Edit' />
      </form>
    </div>
  );
}

export default PromotionsEdit;
