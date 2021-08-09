import * as React from 'react';
import './edit.css';
import { useEffect } from 'react';
import { selectCategories } from '../../../../../features/category/categorySlice';
import { fetch as fetchCategories } from '../../../../../features/category/thunks';
import {
  add as addProduct,
  update as updateProduct,
  fetch as fetchProducts,
} from '../../../../../features/product/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { TestForm } from '../../../../forms/testform';
import { Link, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { selectItems } from '../../../../product/selectors';
import { IProduct } from '../../../../product/productSlice';
import { Loading } from '../../../../../pages/loading/loading.component';

type FormValues = {
  title: string;
  image: string;
  price: number;
  description: string;
  category: string;
  quantity: 1;
  id: number;
};

function Edit(): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const products = useSelector(selectItems);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  function onSubmit(event: React.BaseSyntheticEvent) {
    confirm('Are you sure you want to create this product?') && console.log(event);
    //dispatch(addProduct(data));
    //dispatch(updateProduct(data));
  }
  const cId = Number(id);
  const product = products && products ? products.find((prod: IProduct) => prod.id === cId) : null;
  console.log(product);
  if (product === null || product === undefined) {
    return <Loading />;
  }
  function handleFile(e: any) {
    console.log(URL.createObjectURL(e.currentTarget.files[0]));
  }
  return (
    <div className='admin-create'>
      <div className='admin-create__header'>
        <Link to={`/admin-dashboard/products-dashboard`} id='back-to-products'>
          &larr; Back to Product View
        </Link>
        <div className='admin-create__product_preview'>
          <h1>Product being Edited</h1>
        </div>
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
              name: 'description',
              id: 'description',
              placeholder: 'Product description',
              defaultValue: product.description,
              form: 'create-product',
              rows: 8,
              cols: 48,
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
            },
          ],
        }}
        onSubmit={onSubmit}
        submitlabel='Submit'
        headlabel='Edit a Product'
      />
    </div>
  );
}

export default Edit;
