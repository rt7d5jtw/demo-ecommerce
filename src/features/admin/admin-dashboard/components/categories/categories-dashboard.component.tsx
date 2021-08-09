import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { fetch as fetchProducts, update } from '../../../../../features/product/thunks';
import { selectItems } from '../../../../../features/product/selectors';
import { IProduct } from '../../../../../features/product/productSlice';
import { remove as removeProduct } from '../../../../../features/product/thunks';
import img1 from '../../../../../assets/bar.jpg';
import { Link, useRouteMatch } from 'react-router-dom';
import { Paginator } from '../../../../forms/paginator';
import { selectCategories } from '../../../../category/categorySlice';

type SelectionType = {
  id: string;
};

function CategoriesDashboard(): JSX.Element {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [view, setView] = React.useState<number>(10);
  const [input, setInput] = React.useState({ search: '' });
  const [selections, setSelections] = React.useState<SelectionType[]>([]);

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  }

  function deleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
    const value = (e.target as HTMLInputElement).value;
    selections.length > 1
      ? confirm(`Are you sure you wanna delete ${selections.length} products?`) &&
        console.log(value)
      : selections.length <= 1
      ? confirm('Are you sure you want to delete this product?') &&
        dispatch(removeProduct(Number(value)))
      : null;
  }

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setView(parseInt(e.target.value));
  }

  function onCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    selections.some((obj) => obj.id === e.target.value)
      ? setSelections(selections.filter((obj) => obj.id !== e.target.value))
      : setSelections([...selections, { id: e.target.value }]);
  }

  function onSelectAll(e: React.MouseEvent<HTMLInputElement>): void {
    selections.length === 0
      ? setSelections(categories.map((el) => ({ id: el.id.toString() })))
      : setSelections([]);
  }

  const rankedIndex = categories
    .map((entry) => {
      let points = 0;

      if (entry.cname.toLowerCase().includes(input.search.toLowerCase())) {
        points += 2;
      }

      if (entry.cname.toLowerCase().includes(input.search.toLowerCase())) {
        points += 1;
      }

      return { ...entry, points };
    })
    .sort((a, b) => b.points - a.points);
  const miumau = React.useMemo(() => {
    const firstPage = currentPage * view;
    const lastPage = firstPage + view;
    return categories.slice(firstPage, lastPage);
  }, [currentPage, view]);
  return (
    <div className='admin-products'>
      <div className='admin-products__options'>
        <p>{categories.length} Categories found</p>
        <fieldset id='per-view'>
          <select name='page-view' id='page-view' onChange={onChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </select>
          <label htmlFor='page-view'>Categories per page</label>
        </fieldset>
        <div className='admin-searchbar'>
          <input
            type='search'
            placeholder='Search..'
            name='search'
            value={input.search}
            onChange={onSearch}
            aria-label='Write a keyword for search'
            maxLength={75}
          />
        </div>
        <div>
          <Link id='new-product' to={`/admin-controls/categories-create`}>
            Create a new Category
          </Link>
        </div>
        {selections.length > 0 ? (
          <p id='products-selected'>{selections.length} Categories selected</p>
        ) : null}
        <div id='pagination'>
          <Paginator
            totalItems={categories.length}
            elementsPerPage={view}
            currentPage={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>
              <input type='checkbox' onClick={onSelectAll} />
            </th>
            <th scope='col'></th>
            <th scope='col'></th>
          </tr>
        </thead>
        {input.search.length > 0
          ? rankedIndex.map(({ id, cname }) => (
              <tbody>
                <tr>
                  <td>{id}</td>
                  <td>{cname}</td>
                  <td>
                    <input
                      onChange={onCheckbox}
                      checked={selections.find((e) => e.id === id.toString()) !== undefined}
                      type='checkbox'
                      value={id}
                      name='selection'
                      id='selection'
                    />
                  </td>
                  <td>
                    <Link to={`/admin-controls/categories-edit/${id}`}>Edit</Link>
                  </td>
                  <td>
                    <button onClick={deleteHandler} id='delete-row' value={id}>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            ))
          : miumau.map(({ id, cname }) => (
              <tbody>
                <tr>
                  <td>{id}</td>
                  <td>{cname}</td>
                  <td>
                    <input
                      onChange={onCheckbox}
                      checked={selections.find((e) => e.id === id.toString()) !== undefined}
                      type='checkbox'
                      value={id}
                      name='selection'
                      id='selection'
                    />
                  </td>
                  <td>
                    <Link to={`/admin-controls/categories-edit/${id}`}>Edit</Link>
                  </td>
                  <td>
                    <button onClick={deleteHandler} id='delete-row' value={id}>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
      </table>
    </div>
  );
}

export default CategoriesDashboard;
