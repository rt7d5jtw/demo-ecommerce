import * as React from 'react';
import './edit-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectPromotionItems, update } from '../../../features/promotion/promotionSlice';
import { _Promotions } from '../../../features/promotion/promotionSlice';

type FormValues = {
  title: string;
  image: string;
  link: string;
  id: number;
};

function PromotionsEdit(): JSX.Element {
  const promotions = useAppSelector(selectPromotionItems);
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    dispatch(update(data));
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
        <select {...register('id')} form='edit-promotions' name='id' id='promotions'>
          {promotions.map(({ title, id }: _Promotions) => (
            <option key={id} {...register} value={id}>
              {title}
            </option>
          ))}
        </select>

        <input type='submit' value='Edit' />
      </form>
    </div>
  );
}

export default PromotionsEdit;
