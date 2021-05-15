import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import './search.css';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { search } from '../../redux/product/productSlice';
import { useHistory } from 'react-router';

type Inputs = {
  search: string;
};

export const Search = (): JSX.Element => {
  const [input, setInput] = useState({ search: '' });
  const dispatch = useDispatch();
  const { push } = useHistory();

  const { handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = () => {
    if (input.search) {
      dispatch(search(input.search));
      push('/search-result');
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
          placeholder='Search for books..'
          name='search'
          value={input.search}
          id='searchInput'
          onChange={handleChange}
        />
      </form>
    </div>
  );
};
