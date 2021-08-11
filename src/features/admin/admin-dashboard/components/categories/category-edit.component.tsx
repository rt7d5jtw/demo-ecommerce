import * as React from 'react';
import './category-edit.css';
import { update } from '../../../../../features/category/thunks';
import { ICategory, selectCategories } from '../../../../../features/category/categorySlice';
import { useSelector, useDispatch } from 'react-redux';
import { handleForm } from '../../../../forms/utils/utils';
import { Loading } from '../../../../../pages/loading/loading.component';
import { TestForm } from '../../../../forms/testform';
import Alert from '../../../../alert/alert/alert.component';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export const CategoryEdit = (): JSX.Element => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const [warning, setWarning] = React.useState('');
  const [preview, setPreview] = React.useState({ cname: '' });
  const { id } = useParams<{ id?: string }>();
  const category = categories ? categories.find((cat: ICategory) => cat.id === id) : null;
  if (category === null || category === undefined) {
    return <Loading />;
  }
  React.useEffect(() => {
    if (category) {
      setPreview({ cname: category.cname });
    }
  }, [category]);
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(handleForm(event.currentTarget.elements));
    const values = handleForm(event.currentTarget.elements);
    if (values.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
      console.log(values);
      //confirm('Are you sure you want to create this product?') && dispatch(createPromotion(values));
    } else {
      setWarning('Validation error, give proper inputs');
    }
    //confirm('Are you sure you want to edit this promotion?') && dispatch(update(data));
  }

  return (
    <div className='admin-create'>
      <Alert />
      <div className='admin-create__header'>
        <Link to={`/admin-dashboard/categories-dashboard`} id='back-to-products'>
          &larr; Back to Category Dashboard
        </Link>
        <div className='admin-create__promotion_preview'>
          <h1>Category Preview</h1>
          <div className='admin-create__promotion_preview__col'>
            <p>{preview.cname}</p>
          </div>
        </div>
      </div>
      <h1 id='promotions__header'>Edit Category</h1>
      <TestForm
        fields={{
          labels: [
            {
              orderIdentifier: 1,
              label: 'Category name',
              htmlFor: 'name',
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
              defaultValue: category.cname,
              maxLength: 256,
              minLength: 3,
              required: true,
              onChange: (e) => setPreview({ cname: (e.target as HTMLInputElement).value }),
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
};
