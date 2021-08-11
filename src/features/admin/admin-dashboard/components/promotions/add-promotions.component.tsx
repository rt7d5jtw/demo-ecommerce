import * as React from 'react';
import './add-promotions.css';
import { useDispatch } from 'react-redux';
import { create as createPromotion } from '../../../../promotion/thunks';
import Alert from '../../../../alert/alert/alert.component';
import { TestForm } from '../../../../forms/testform';
import { handleForm } from '../../../../forms/utils/utils';
import { Link } from 'react-router-dom';

function PromotionsAdd(): JSX.Element {
  const dispatch = useDispatch();
  const [warning, setWarning] = React.useState('');
  const [preview, setPreview] = React.useState({ title: '', image: '' });
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log(event);
    event.preventDefault();
    const values = handleForm(event.currentTarget.elements);
    if (values.title.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
      console.log(values);
      //confirm('Are you sure you want to create this product?') && dispatch(createPromotion(values));
    } else {
      setWarning('Validation error, give proper inputs');
    }
  }
  return (
    <div className='admin-create'>
      <Alert />
      <div className='admin-create__header'>
        <Link to={`/admin-dashboard/categories-dashboard`} id='back-to-products'>
          &larr; Back to Promotions Dashboard
        </Link>
        <div className='admin-create__promotion_preview'>
          <h1>Promotion Preview</h1>
          <div className='admin-create__promotion_preview__col'>
            {preview.image === null ? (
              <div id='empty-img' />
            ) : preview.image && preview.image.substr(0, 4) === 'blob' ? (
              <img src={preview.image} />
            ) : null}
            <p>{preview.title}</p>
          </div>
        </div>
      </div>
      <h1 id='promotions__header'>Create Promotions</h1>
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
              maxLength: 256,
              minLength: 3,
              required: true,
              onChange: (e) =>
                setPreview({ ...preview, title: (e.target as HTMLInputElement).value }),
            },
            {
              orderIdentifier: 4,
              type: 'file',
              name: 'image',
              id: 'image',
              title: 'Pick an image',
              required: true,
              onChange: (e) => {
                if ((e.currentTarget as HTMLInputElement).files) {
                  setPreview({
                    ...preview,
                    image: URL.createObjectURL((e.currentTarget as HTMLInputElement).files![0]),
                  });
                }
              },
            },
          ],
          warning: [{ orderIdentifier: 11, warning: warning }],
        }}
        onSubmit={onSubmit}
        submitlabel='Submit'
        headlabel=''
      />
    </div>
  );
}

export default PromotionsAdd;
