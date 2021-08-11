import * as React from 'react';
import './category-create.css';
import { useDispatch } from 'react-redux';
import { create as createCategory } from '../../../../../features/category/thunks';
import Alert from '../../../../alert/alert/alert.component';
import { Link } from 'react-router-dom';
import { TestForm } from '../../../../forms/testform';
import { handleForm } from '../../../../forms/utils/utils';

function CategoryCreate(): JSX.Element {
  const dispatch = useDispatch();
  const [preview, setPreview] = React.useState<{ title: string }>({ title: '' });
  const [warning, setWarning] = React.useState<string>('');
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(event.currentTarget.elements);
    const values = handleForm(event.currentTarget.elements);
    if (values.name.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
      confirm('Are you sure you want to create this category?') && dispatch(createCategory(values));
    } else {
      setWarning('Validation error, give proper inputs');
    }
  }
  return (
    <div className='admin-create__categories'>
      <Alert />
      <div className='admin-create__header'>
        <Link to={`/admin-dashboard/categories-dashboard`} id='back-to-products'>
          &larr; Back to Categories View
        </Link>
        <div className='admin-create__category_preview'>
          <h1>Category Preview</h1>
          <div className='admin-create__category_preview__col'>
            <p>{preview.title}</p>
          </div>
        </div>
      </div>
      <h1 id='category__header'>Create Categories</h1>
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
              name: 'name',
              id: 'name',
              placeholder: 'Category name',
              title: 'You must specify the name of the category',
              maxLength: 256,
              minLength: 3,
              required: true,
              onChange: (e) =>
                setPreview({ ...preview, title: (e.target as HTMLInputElement).value }),
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

export default CategoryCreate;
