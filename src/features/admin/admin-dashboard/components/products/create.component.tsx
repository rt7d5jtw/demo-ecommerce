import * as React from 'react';
import './create.css';
import { useDispatch, useSelector } from 'react-redux';
import { add as addProduct } from '../../../../../features/product/thunks';
import { IProduct, ProductDto } from '../../../../../features/product/productSlice';
import { selectCategories } from '../../../../category/categorySlice';
import { Link } from 'react-router-dom';
import { TestForm } from '../../../../forms/testform';
import { handleForm, handleFormCategories } from '../../../../forms/utils/utils';

type FormActionConstants = 'title' | 'price' | 'description' | 'categories' | 'image';

interface FormAction {
  type: FormActionConstants;
  payload: any;
}

type IFormProduct = Partial<IProduct>;

export function FormProductPreview({
  image,
  title,
  price,
  description,
  categories,
}: IFormProduct): JSX.Element {
  return (
    <div className='admin-create__product_preview'>
      <h1>Product Preview</h1>
      {image === null ? (
        <div id='empty-img' />
      ) : image && image.substr(0, 4) === 'blob' ? (
        <img src={image} />
      ) : (
        <img src={require(`../../../../../assets/${image}`)} />
      )}
      <div className='admin-create__product_preview__col'>
        <p>{title}</p>
        <p>{price}</p>
      </div>
      <p id='admin-create__product_preview-desc'>{description}</p>
      <p id='admin-create__product_preview-desc'>{categories}</p>
    </div>
  );
}

function formReducer(state: FormState, action: FormAction) {
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

type FormState = {
  title: string;
  price: number | null;
  description: string;
  categories: string[];
  image: File | null;
};

const initialState: FormState = {
  title: '',
  price: null,
  description: '',
  categories: [],
  image: null,
};

function Create(): JSX.Element {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  const [warning, setWarning] = React.useState<string>('');

  function onSubmit(event: React.BaseSyntheticEvent) {
    event.preventDefault();
    const values = handleForm(event.currentTarget.elements);
    const categoryIds = handleFormCategories(event.currentTarget.elements['categoryIds']);
    if (values.title.match(/^[^-\s][a-zA-Z0-9_\s-]+$/gi) !== null) {
      confirm('Are you sure you want to create this product?') &&
        dispatch(addProduct({ ...values, categoryIds } as ProductDto));
    } else {
      setWarning('Validation error, give proper inputs');
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
              orderIdentifier: 5,
              label: 'Product image',
              htmlFor: 'image',
            },
            {
              orderIdentifier: 3,
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
                value: val.id,
                label: val.cname,
              })),
              onStateListener: (e) =>
                formDispatch({
                  type: 'categories',
                  payload: e.values.map(({ name }) => name).join(', '),
                }),
            },
          ],
          input: [
            {
              orderIdentifier: 2,
              type: 'text',
              name: 'title',
              id: 'title',
              placeholder: 'Product title',
              title: 'You must specify a title',
              maxLength: 256,
              minLength: 3,
              required: true,
              onChange: (e) =>
                formDispatch({ type: 'title', payload: (e.target as HTMLInputElement).value }),
            },
            {
              orderIdentifier: 6,
              type: 'file',
              name: 'image',
              id: 'image',
              title: 'Pick an image',
              required: true,
              onChange: (e) => {
                if ((e.currentTarget as HTMLInputElement).files) {
                  formDispatch({
                    type: 'image',
                    payload: URL.createObjectURL(
                      ((e.currentTarget as HTMLInputElement).files as FileList)[0]
                    ),
                  });
                }
              },
            },
            {
              orderIdentifier: 4,
              type: 'number',
              name: 'price',
              id: 'price',
              step: '0.01',
              pattern: new RegExp(/^[0-9]*$/).toString().slice(1, -1),
              placeholder: 'Product Price',
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
        headlabel='Create Products'
      />
    </div>
  );
}

export default Create;
