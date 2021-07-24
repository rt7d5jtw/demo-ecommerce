import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import './search.css';
import { useDispatch, useSelector } from 'react-redux';
import { search } from '../../product/thunks';
import { useHistory } from 'react-router';
import { selectSearch, selectSearchItems } from '../../product/selectors';
import { BsSearch } from 'react-icons/bs';

export const Search = (): JSX.Element => {
  const searchItems = useSelector(selectSearchItems);
  const searchKeyword = useSelector(selectSearch);
  const [input, setInput] = useState({ search: '' });
  const dispatch = useDispatch();
  const { push } = useHistory();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.search) {
      dispatch(search(input.search));
      if (searchItems !== null && searchKeyword !== null) return push('/search-result');
    }
    console.log(e);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  };

  return (
    <form className='search' role='search' onSubmit={handleSubmit}>
      <div className='search__wrapper'>
        <div className='search__wrapper__left'>
          <input
            type='search'
            placeholder='Search..'
            name='search'
            value={input.search}
            id='searchInput'
            onChange={handleChange}
            aria-label='Write a keyword for search'
            maxLength={75}
          />
        </div>
        <div className='search__wrapper__right'>
          <button
            style={input.search.length > 0 ? { visibility: 'visible' } : {}}
            aria-label='Search'
            name='submit_search'
            type='submit'
            aria-disabled='true'
          >
            <BsSearch id='search-icon' />
          </button>
        </div>
      </div>
    </form>
  );
};
