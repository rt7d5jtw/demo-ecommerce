import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import './search.css';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { search } from '../../product/thunks';
import { useHistory } from 'react-router';
import { selectSearch, selectSearchItems } from '../../product/selectors';

type Inputs = {
  search: string;
};

export const Search = (): JSX.Element => {
  const searchItems = useSelector(selectSearchItems);
  const searchKeyword = useSelector(selectSearch);
  const [input, setInput] = useState({ search: '' });
  const dispatch = useDispatch();
  const { push } = useHistory();

  const { handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = () => {
    if (input.search) {
      dispatch(search(input.search));
      if (searchItems !== null && searchKeyword !== null) return push('/search-result');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  };

  return (
    <div className='search__container'>
      <form className='search-form' action='/search-result' onSubmit={handleSubmit(onSubmit)}>
        <input
          type='text'
          placeholder='Search for Products..'
          name='search'
          value={input.search}
          id='searchInput'
          onChange={handleChange}
        />
      </form>
    </div>
  );
};
