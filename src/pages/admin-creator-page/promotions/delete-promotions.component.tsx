import * as React from 'react';
import './delete-promotions.css';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectPromotions } from '../../../redux/promotions/promotions.selectors';
import { fetch, remove } from '../../../redux/promotions/promotions.actions';

type FormValues = {
  id: string;
};

function PromotionsDelete(): JSX.Element {
  const dispatch = useDispatch();
  const promotions = useSelector(selectPromotions);
  useEffect(() => {
    //dispatch(fetch());
  }, [dispatch]);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    //dispatch(remove(data))
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
