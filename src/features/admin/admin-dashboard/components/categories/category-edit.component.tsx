import * as React from 'react';
import './category-edit.css';
import { update as updateCategory } from '../../../../../features/category/thunks';
import { ICategory, selectCategories } from '../../../../../features/category/categorySlice';
import { useSelector, useDispatch } from 'react-redux';
import { handleForm } from '../../../../forms/utils/utils';
import { Loading } from '../../../../../pages/loading/loading.component';
import { TestForm } from '../../../../forms/testform';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export const CategoryEdit = (): JSX.Element => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const [warning, setWarning] = React.useState('');
  const { id } = useParams<{ id?: string }>();
  const category = categories ? categories.find((cat: ICategory) => cat.id === id) : null;
  if (category === null || category === undefined) {
    return <Loading />;
  }
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = handleForm(event.currentTarget.elements);
    if (values.title.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
      if (id) {
        confirm('Are you sure you want to create this product?') &&
          dispatch(updateCategory({ id: id, cname: values.title }));
      } else {
        setWarning('Validation error, give proper inputs');
      }
    }
  }

  return (
    <div className='admin-create'>
      <div className='admin-create__header'>
        <Link to={`/admin-dashboard/categories-dashboard`} id='back-to-categories'>
          &larr; Back to Category Dashboard
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
              name: 'title',
              id: 'title',
              placeholder: 'Promotion title',
              title: 'You must specify the title of the promotion',
              defaultValue: category.cname,
              maxLength: 256,
              minLength: 3,
              required: true,
            },
          ],
          warning: [{ orderIdentifier: 11, warning: warning }],
        }}
        onSubmit={onSubmit}
        submitlabel='Submit'
        headlabel='Edit a category'
      />
    </div>
  );
};
