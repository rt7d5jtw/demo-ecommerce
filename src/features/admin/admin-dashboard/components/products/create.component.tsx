import * as React from 'react';
import './create.css';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectItems } from '../../../../../features/product/selectors';
import { fetch, remove } from '../../../../../features/product/thunks';
import { IProduct } from '../../../../../features/product/productSlice';
import { selectCategories } from '../../../../category/categorySlice';
import { Link, useParams } from 'react-router-dom';
import { TestForm } from '../../../../forms/testform';

type FormAction =
  | { type: 'title'; payload: string }
  | { type: 'price'; payload: string }
  | { type: 'description'; payload: string }
  | { type: 'categories'; payload: string }
  | { type: 'image'; payload: FileList };

type IFormProduct = Partial<IProduct>;

export function FormProductPreview({ image, title, price, description, categories }: IFormProduct) {
  return (
    <div className='admin-create__product_preview'>
      <h1>Product Preview</h1>
      {image === null ? <div id='empty-img' /> : <img src={image} />}
      <div className='admin-create__product_preview__col'>
        <p>{title}</p>
        <p>{price}</p>
      </div>
      <p id='admin-create__product_preview-desc'>{description}</p>
      <p id='admin-create__product_preview-desc'>{categories}</p>
    </div>
  );
}

function formReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }
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

function Create(): JSX.Element {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  function onSubmit(event: React.BaseSyntheticEvent) {
    confirm('Are you sure you want to create this product?') && console.log(event);
    //dispatch(addProduct(data));
    //dispatch(updateProduct(data));
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(formState);
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
              name: 'description',
              id: 'description',
              placeholder: 'Product description',
              form: 'create-product',
              rows: 8,
              cols: 48,
              onChange: (e) =>
                formDispatch({
                  type: 'description',
                  payload: (e.target as HTMLInputElement).value,
                }),
            },
          ],
          select: [
            {
              orderIdentifier: 8,
              form: 'create-product',
              name: 'category',
              id: 'category',
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
                    payload: URL.createObjectURL((e.currentTarget as HTMLInputElement).files[0]),
                  });
                }
              },
            },
            {
              orderIdentifier: 4,
              type: 'number',
              name: 'price',
              id: 'price',
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
        }}
        onSubmit={onSubmit}
        submitlabel='Submit'
        headlabel='Create Products'
      />
    </div>
  );
}

export default Create;
