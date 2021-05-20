import * as React from 'react';
import './delete-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectPromotionItems, _Promotions } from '../../../features/promotion/promotionSlice';
import { remove } from '../../../features/promotion/promotionSlice';

type FormValues = {
  id: string;
};

function PromotionsDelete(): JSX.Element {
  const dispatch = useAppDispatch();
  const promotions = useAppSelector(selectPromotionItems);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(remove(data.id));
  };
  return (
    <div className='delete-promotions'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Delete a product</label>
        <select {...register('id')} id='promotions'>
          {promotions.map(({ id, title }: _Promotions) => (
            <option value={id} key={id}>
              {title}
            </option>
          ))}
        </select>
        <input type='submit' value='Delete' />
      </form>
    </div>
  );
}

export default PromotionsDelete;
