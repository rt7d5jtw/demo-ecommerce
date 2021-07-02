import * as React from 'react';
import './delete-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IPromotions } from '../../../features/promotion/promotionSlice';
import { selectPromotionItems } from '../../../features/promotion/selectors';
import { remove } from '../../../features/promotion/thunks';
import { useDispatch, useSelector } from 'react-redux';

type FormValues = {
  id: number;
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
          {promotions.map(({ id, title }: IPromotions) => (
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
