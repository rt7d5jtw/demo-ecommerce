import * as React from 'react';
import './delete-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { selectPromotionItems, _Promotions } from '../../../features/promotion/promotionSlice';
import { remove } from '../../../features/promotion/promotionSlice';
import { useDispatch, useSelector } from 'react-redux';

type FormValues = {
  id: string;
};

function PromotionsDelete(): JSX.Element {
  const dispatch = useDispatch();
  const promotions = useSelector(selectPromotionItems);
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
