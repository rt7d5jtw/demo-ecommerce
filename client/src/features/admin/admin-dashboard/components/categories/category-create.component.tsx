import * as React from 'react';
import './category-create.css';
import { useDispatch, useSelector } from 'react-redux';
import { create as createCategory } from '../../../../../features/category/thunks';
import { Link } from 'react-router-dom';
import { TestForm } from '../../../../forms/testform';
import { handleForm } from '../../../../forms/utils/utils';
import { selectRole } from '../../../../user/selectors';

function CategoryCreate(): JSX.Element {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const [preview, setPreview] = React.useState<{ title: string }>({
    title: '',
  });
  const [warning, setWarning] = React.useState<string>('');
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role === 'GUEST') {
      alert(`You dont have sufficient rights to do a submission`);
      return;
    }
    const values = handleForm(event.currentTarget.elements);
    if (values.cname.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
      confirm('Are you sure you want to create this category?') &&
        dispatch(createCategory(values.cname));
    } else {
      setWarning('Validation error, give proper inputs');
    }
  }
  return (
    <div className='admin-create__categories'>
      <div className='admin-create__header'>
        <Link
          to={`/admin-dashboard/categories-dashboard`}
          id='back-to-categories'
        >
          &larr; Back to Categories View
        </Link>
      </div>
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
              name: 'cname',
              id: 'cname',
              placeholder: 'Category name',
              title: 'You must specify the name of the category',
              maxLength: 256,
              minLength: 3,
              required: true,
              onChange: (e) =>
                setPreview({
                  ...preview,
                  title: (e.target as HTMLInputElement).value,
                }),
            },
          ],
          warning: [{ orderIdentifier: 11, warning: warning }],
        }}
        onSubmit={onSubmit}
        submitlabel='Submit'
        headlabel='Create a Category'
      />
    </div>
  );
}

export default CategoryCreate;
