import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Paginator } from '../../../../forms/paginator';
import { selectCategories } from '../../../../category/categorySlice';
import { fetchCategories } from '../../../../category/api';
import { remove as removeCategory } from '../../../../category/thunks';

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

  React.useEffect(() => {
    fetchCategories();
  }, [categories]);

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  }

  function deleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
    selections.length <= 1
      ? confirm('Are you sure you want to delete this product?') &&
        dispatch(removeCategory(JSON.parse(e.currentTarget.value)))
      : null;
  }

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setView(parseInt(e.target.value));
  }

  function onCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const category = JSON.parse(e.target.value);
    selections.some((obj) => obj.id === category.id)
      ? setSelections(selections.filter((obj) => obj.id !== category.id))
      : setSelections([...selections, { id: category.id }]);
  }

  function onSelectAll(): void {
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
          <Link id='new-category' to={`/admin-dashboard/categories-dashboard/categories-create`}>
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
        <tbody>
          {input.search.length > 0
            ? rankedIndex.map(({ id, cname }) => (
                <tr key={id}>
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
                    <Link
                      to={`/admin-dashboard/categories-dashboard/categories-edit/${id}`}
                      id='edit-link'
                    >
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={deleteHandler}
                      id='delete-row'
                      value={JSON.stringify({ id, cname })}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            : miumau.map(({ id, cname }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{cname}</td>
                  <td>
                    <input
                      onChange={onCheckbox}
                      checked={selections.find((e) => e.id === id.toString()) !== undefined}
                      type='checkbox'
                      value={JSON.stringify({ id, cname })}
                      name='selection'
                      id='selection'
                    />
                  </td>
                  <td>
                    <Link
                      to={`/admin-dashboard/categories-dashboard/categories-edit/${id}`}
                      id='edit-link'
                    >
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={deleteHandler}
                      id='delete-row'
                      value={JSON.stringify({ id, cname })}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriesDashboard;
