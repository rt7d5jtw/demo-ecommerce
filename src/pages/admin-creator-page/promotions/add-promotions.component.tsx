import * as React from 'react';
import './add-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '../../../app/hooks';
import { add } from '../../../features/promotion/promotionSlice';

type FormValues = {
  title: string;
  image: string;
  url: string;
};

function PromotionsAdd(): JSX.Element {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    dispatch(add(data));
  };
  return (
    <div className='add-promotions'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Add a promotion</h1>
        <input
          type='text'
          placeholder='Title'
          {...register('title')}
          title='Descriptive title to differentiate the promotions'
          required
        />
        <input
          type='text'
          placeholder='URL'
          {...register('url')}
          title='Promotion URL Link to the page'
          required
        />
        <input
          type='text'
          placeholder='Images preferrably 1470 x 556'
          {...register('image')}
          title='url to the image'
          required
        />
        <input type='submit' value='Add' />
      </form>
    </div>
  );
}

export default PromotionsAdd;
