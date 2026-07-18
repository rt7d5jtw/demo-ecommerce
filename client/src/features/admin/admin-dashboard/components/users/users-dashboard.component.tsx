import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Paginator } from '../../../../forms/paginator';
import { selectUsers } from '../../../../user/selectors';
import { fetch as fetchUsers, removeUser } from '../../../../user/thunks';
import { selectRole } from '../../../../user/selectors';

type SelectionType = {
  id: string;
};

function UserDashboard(): JSX.Element {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const role = useSelector(selectRole);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [view, setView] = React.useState<number>(10);
  const [input, setInput] = React.useState({ search: '' });
  const [selections, setSelections] = React.useState<SelectionType[]>([]);

  React.useEffect(() => {
    users.length <= 0 ? dispatch(fetchUsers()) : null;
  }, [users]);

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  }

  function deleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
    if (role === 'GUEST') {
      alert(`You dont have sufficient rights to do a submission`);
      return;
    }
    const value = (e.target as HTMLInputElement).value;
    selections.length <= 1
      ? confirm('Are you sure you want to delete this user?') &&
        dispatch(removeUser(value))
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

  function onSelectAll(): void {
    selections.length === 0
      ? setSelections(users.map((el) => ({ id: el.id.toString() })))
      : setSelections([]);
  }

  const rankedIndex = users
    .map((entry) => {
      let points = 0;

      if (entry.email.toLowerCase().includes(input.search.toLowerCase())) {
        points += 2;
      }

      if (entry.email.toLowerCase().includes(input.search.toLowerCase())) {
        points += 1;
      }

      return { ...entry, points };
    })
    .sort((a, b) => b.points - a.points);
  const miumau = React.useMemo(() => {
    const firstPage = currentPage * view;
    const lastPage = firstPage + view;
    return users.slice(firstPage, lastPage);
  }, [currentPage, view]);
  return (
    <div className='admin-products'>
      <div className='admin-products__options'>
        <p>{users.length} Users found</p>
        <fieldset id='per-view'>
          <select name='page-view' id='page-view' onChange={onChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </select>
          <label htmlFor='page-view'>Users per page</label>
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
        {selections.length > 0 ? (
          <p id='products-selected'>{selections.length} Products selected</p>
        ) : null}
        <div id='pagination'>
          <Paginator
            totalItems={users.length}
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
            <th scope='col'>Email</th>
            <th scope='col'>Role</th>
            <th scope='col'>Creation Date</th>
            <th scope='col'>
              <input type='checkbox' onClick={onSelectAll} />
            </th>
            <th scope='col'></th>
          </tr>
        </thead>
        {input.search.length > 0
          ? rankedIndex.map(({ id, email, role, createdAt }) => (
              <tbody key={id}>
                <tr>
                  <td>{id}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{createdAt}</td>
                  <td>
                    <input
                      onChange={onCheckbox}
                      checked={
                        selections.find((e) => e.id === id.toString()) !==
                        undefined
                      }
                      type='checkbox'
                      value={id}
                      name='selection'
                      id='selection'
                    />
                  </td>
                  <td>
                    <Link to={`/admin-controls/products-edit/${id}`}>Edit</Link>
                  </td>
                  <td>
                    <button onClick={deleteHandler} id='delete-row' value={id}>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            ))
          : miumau.map(({ id, email, role, createdAt }) => (
              <tbody key={id}>
                <tr>
                  <td>{id}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{createdAt}</td>
                  <td>
                    <input
                      onChange={onCheckbox}
                      checked={
                        selections.find((e) => e.id === id.toString()) !==
                        undefined
                      }
                      type='checkbox'
                      value={id}
                      name='selection'
                      id='selection'
                    />
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

export default UserDashboard;
