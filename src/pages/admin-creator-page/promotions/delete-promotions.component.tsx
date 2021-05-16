import * as React from 'react';
import './delete-promotions.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectPromotions } from '../../../redux/promotions/promotionsSlice';
import { remove } from '../../../redux/promotions/promotionsSlice';

type FormValues = {
  id: string;
};

function PromotionsDelete(): JSX.Element {
  const dispatch = useDispatch();
  const promotions = useSelector(selectPromotions);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(remove(data.id));
  };
  return (
    <div className='delete-promotions'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Delete a product</label>
        <select {...register('id')} id='promotions'>
          {promotions.map(({ id, title }: any) => (
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
