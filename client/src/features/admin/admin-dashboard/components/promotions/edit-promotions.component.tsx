import * as React from 'react';
import './edit-promotions.css';
import { selectPromotionItems } from '../../../../../features/promotion/selectors';
import { update as updatePromotion } from '../../../../../features/promotion/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { TestForm } from '../../../../forms/testform';
import { handleForm } from '../../../../forms/utils/utils';
import { IPromotions } from '../../../../promotion/promotionSlice';
import { Loading } from '../../../../../pages/loading/loading.component';
import { selectRole } from '../../../../user/selectors';
import { UpdateProductDto } from '../../../../product/productSlice';

function PromotionsEdit(): JSX.Element {
  const promotions = useSelector(selectPromotionItems);
  const role = useSelector(selectRole);
  const [warning, setWarning] = React.useState('');
  const { id } = useParams<{ id?: string }>();
  const cId = id && (parseInt(id) as number);
  const promotion = promotions
    ? promotions.find((prom: IPromotions) => prom.id === Number(id))
    : null;
  if (promotion === null || promotion === undefined) {
    return <Loading />;
  }
  const dispatch = useDispatch();
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role === 'GUEST') {
      alert(`You dont have sufficient rights to do a submission`);
      return;
    }
    const values = handleForm(event.currentTarget.elements);
    if (values.title.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null && id) {
      confirm('Are you sure you want to create this product?') &&
        dispatch(updatePromotion({ id: cId, ...values } as UpdateProductDto));
    } else {
      setWarning('Validation error, give proper inputs');
    }
  }
  return (
    <div className='admin-create'>
      <div className='admin-create__header'>
        <Link
          to={`/admin-dashboard/promotions-dashboard`}
          id='back-to-promotions'
        >
          &larr; Back to Promotions Dashboard
        </Link>
      </div>
      <TestForm
        fields={{
          labels: [
            {
              orderIdentifier: 1,
              label: 'Promotion title',
              htmlFor: 'title',
            },
            {
              orderIdentifier: 3,
              label: 'Promotion url',
              htmlFor: 'url',
            },
            {
              orderIdentifier: 5,
              label: 'Promotion image',
              htmlFor: 'image',
            },
          ],
          input: [
            {
              orderIdentifier: 2,
              type: 'text',
              name: 'title',
              id: 'title',
              placeholder: 'Promotion title',
              title: 'You must specify the title of the promotion',
              defaultValue: promotion.title,
              maxLength: 256,
              minLength: 3,
              required: true,
            },
            {
              orderIdentifier: 4,
              type: 'text',
              name: 'url',
              id: 'url',
              placeholder: 'Promotion url',
              title: 'You must specify the url of the promotion',
              defaultValue: promotion.url,
              maxLength: 256,
              minLength: 3,
              required: true,
            },
            {
              orderIdentifier: 6,
              type: 'file',
              name: 'image',
              id: 'image',
              title: 'Pick an image',
              required: true,
            },
          ],
          warning: [{ orderIdentifier: 11, warning: warning }],
        }}
        onSubmit={onSubmit}
        submitlabel='Submit'
        headlabel='Edit a promotion'
      />
    </div>
  );
}

export default PromotionsEdit;
