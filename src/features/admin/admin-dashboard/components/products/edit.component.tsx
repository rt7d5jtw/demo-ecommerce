import * as React from 'react';
import './edit.css';
import { selectCategories } from '../../../../../features/category/categorySlice';
import { update as updateProduct } from '../../../../../features/product/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { TestForm } from '../../../../forms/testform';
import { Link, useParams } from 'react-router-dom';
import { selectItems } from '../../../../product/selectors';
import { IProduct } from '../../../../product/productSlice';
import { Loading } from '../../../../../pages/loading/loading.component';
import { handleForm } from '../../../../forms/utils/utils';
import { FormProductPreview } from './create.component';

type FormAction =
  | { type: 'title'; payload: string }
  | { type: 'price'; payload: string }
  | { type: 'description'; payload: string }
  | { type: 'categories'; payload: string }
  | { type: 'image'; payload: File };

function formReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case 'title': {
      return {
        ...state,
        title: action.payload,
      };
    }
    case 'price': {
      return {
        ...state,
        price: action.payload,
      };
    }
    case 'description': {
      return {
        ...state,
        description: action.payload,
      };
    }
    case 'categories': {
      return {
        ...state,
        categories: action.payload,
      };
    }
    case 'image': {
      return {
        ...state,
        image: action.payload,
      };
    }
    default:
      return state;
  }
}

const initialState = {
  title: '',
  price: null,
  description: '',
  categories: [],
  image: null,
};

function Edit(): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const products = useSelector(selectItems);
  const categories = useSelector(selectCategories);
  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  const [warning, setWarning] = React.useState<string>('');
  const dispatch = useDispatch();
  const cId = Number(id);

  const product = products && products ? products.find((prod: IProduct) => prod.id === cId) : null;
  if (product === null || product === undefined) {
    return <Loading />;
  }

  React.useEffect(() => {
    if (product) {
      formDispatch({ type: 'title', payload: product.title });
      formDispatch({ type: 'price', payload: '$' + product.price });
      formDispatch({ type: 'description', payload: product.description });
      formDispatch({
        type: 'categories',
        payload: product.categories.map(({ cname }) => cname).join(', '),
      });
      formDispatch({ type: 'image', payload: product.image });
    }
  }, [product]);

  function onSubmit(event: React.BaseSyntheticEvent) {
    event.preventDefault();
    const categoryValues: { id: string }[] = [];
    Array.from(event.currentTarget.elements).forEach((e) => {
      if ((e as HTMLSelectElement).nodeName === 'SELECT') {
        Array.from((e as HTMLSelectElement).selectedOptions).forEach((e) => {
          categoryValues.push({ id: (e as HTMLOptionElement).value });
        });
      }
    });
    const values = handleForm(event.currentTarget.elements);
    values['categoryIds'] = categoryValues;
    if (values.title.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
      console.log(values);
      confirm('Are you sure you want to edit this product?') && dispatch(updateProduct(values));
    } else {
      setWarning('Validation error, give proper inputs');
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files) {
      formDispatch({
        type: 'image',
        payload: URL.createObjectURL((e.currentTarget as HTMLInputElement).files![0]),
      });
    }
  }
  return (
    <div className='admin-create'>
      <div className='admin-create__header'>
        <Link to={`/admin-dashboard/products-dashboard`} id='back-to-products'>
          &larr; Back to Product View
        </Link>
        <FormProductPreview
          image={formState.image}
          categories={formState.categories}
          title={formState.title}
          description={formState.description}
          price={formState.price}
        />
      </div>
      <TestForm
        fields={{
          labels: [
            {
              orderIdentifier: 1,
              label: 'Product title',
              htmlFor: 'title',
            },
            {
              orderIdentifier: 3,
              label: 'Product image',
              htmlFor: 'image',
            },
            {
              orderIdentifier: 5,
              label: 'Product Price',
              htmlFor: 'price',
            },
            {
              orderIdentifier: 7,
              label: 'Product Category',
              htmlFor: 'category',
            },
            {
              orderIdentifier: 9,
              label: 'Product Description',
              htmlFor: 'description',
            },
          ],
          textarea: [
            {
              orderIdentifier: 10,
              form: 'badumts-form',
              name: 'description',
              id: 'description',
              placeholder: 'Product description',
              defaultValue: product.description,
              rows: 8,
              cols: 48,
              onChange: (e) =>
                formDispatch({
                  type: 'description',
                  payload: (e.target as HTMLInputElement).value,
                }),
            },
          ],
          multiselect: [
            {
              orderIdentifier: 8,
              label: 'Categories',
              form: 'badumts-form',
              name: 'categoryIds',
              id: 'categoryIds',
              required: true,
              options: categories.map((val) => ({
                id: val.id,
                value: val.cname,
                label: val.cname,
              })),
              onChange: (e) =>
                formDispatch({ type: 'categories', payload: (e.target as HTMLInputElement).value }),
            },
          ],
          input: [
            {
              orderIdentifier: 2,
              type: 'text',
              name: 'title',
              id: 'title',
              placeholder: 'Product title',
              defaultValue: product.title,
              title: 'You must specify a title',
              maxLength: 256,
              minLength: 3,
              required: true,
              onChange: (e) =>
                formDispatch({ type: 'title', payload: (e.target as HTMLInputElement).value }),
            },
            {
              orderIdentifier: 4,
              type: 'file',
              name: 'image',
              id: 'image',
              title: 'Pick an image',
              required: true,
              onChange: handleFile,
            },
            {
              orderIdentifier: 6,
              type: 'number',
              name: 'price',
              id: 'price',
              pattern: new RegExp(/^[0-9]*$/).toString().slice(1, -1),
              placeholder: 'Product Price',
              defaultValue: product.price.toString(),
              title: 'Specify a price',
              required: true,
              onChange: (e) =>
                formDispatch({
                  type: 'price',
                  payload: '$' + (e.target as HTMLInputElement).value,
                }),
            },
          ],
          warning: [{ orderIdentifier: 11, warning: warning }],
        }}
        onSubmit={onSubmit}
        submitlabel='Submit'
        headlabel='Edit a Product'
      />
    </div>
  );
}

export default Edit;
