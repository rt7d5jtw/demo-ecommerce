import * as React from 'react';
import './edit-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { selectPromotionItems } from '../../../../../features/promotion/selectors';
import { update } from '../../../../../features/promotion/thunks';
import { IPromotions } from '../../../../../features/promotion/promotionSlice';
import { useDispatch, useSelector } from 'react-redux';

type FormValues = {
  title: string;
  image: string;
  url: string;
  id: number;
};

function PromotionsEdit(): JSX.Element {
  const promotions = useSelector(selectPromotionItems);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    confirm('Are you sure you want to edit this promotion?') && dispatch(update(data));
  };
  return (
    <div className='admin-update'>
      <div className='promotion-update'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Edit a promotion</h1>
          <input type='text' placeholder='Title' {...register('title')} required />
          <input type='text' placeholder='URL' {...register('url')} required />
          <input
            type='text'
            placeholder='Images preferrably 1470 x 556'
            {...register('image')}
            required
          />
          <select {...register('id')} form='edit-promotions' name='id' id='promotions2'>
            {promotions.map(({ title, id }: IPromotions) => (
              <option key={id} {...register} value={id}>
                {title}
              </option>
            ))}
          </select>

          <input type='submit' value='Edit' />
        </form>
      </div>
    </div>
  );
}

export default PromotionsEdit;
