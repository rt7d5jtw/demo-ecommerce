import * as React from 'react';
import './add-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { create } from '../../../features/promotion/thunks';
import { useDispatch } from 'react-redux';

type FormValues = {
  title: string;
  image: string;
  url: string;
  id: number;
};

function PromotionsAdd(): JSX.Element {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    confirm('Are you sure you want to create this promotion?') && dispatch(create(data));
  };
  return (
    <div className='admin-create'>
      <div className='promotion-create'>
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
    </div>
  );
}

export default PromotionsAdd;
